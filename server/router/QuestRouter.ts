import express, { type Router, type Request, type Response } from "express";
import { authenticationTokenValidation } from "../middleware/AuthenticationTokenValidation.js";
import { HTTPError } from "../modules/Error/HTTPError/index.js";
import { HTTP_RESPONSE_STATUS_CODE } from "../modules/Constant/HTTPResponseStatusCode/index.js";
import type { QueryResult } from "pg";
import { POOL } from "../modules/Database/PostgreSQL.js";
import type { RequestBody, RequestWithAuthenticationToken } from "../types/Request/type.js";
import IsolatedVM from "isolated-vm";
import type { QuestData } from "../types/Question/QuestData.js";
import { QuestionVariable, QuestionVariableType } from "../types/Question/QuestionVariable.js";
import { Answer, AnswerType } from "../types/Answer/Answer.js";
import { asyncRouterErrorHandler } from "../handler/AsyncRouterErrorHandler.js";
import { Question, QuestionType } from "../types/Question/Question.js";

export const ROUTER: Router = express.Router();

/**
 * 取得題目列表
 */
ROUTER.post(
	"/getList",
	authenticationTokenValidation(1),
	asyncRouterErrorHandler(async (req: RequestBody<{ begin: number; end: number }>, res: Response) => {
		/**
		 * 查詢題目資料
		 */
		const { begin: QUERY_RANGE_BEGIN, end: QUERY_RANGE_END } = req.body;

		if (
			Number.isNaN(QUERY_RANGE_BEGIN) ||
			Number.isNaN(QUERY_RANGE_END) ||
			QUERY_RANGE_END < QUERY_RANGE_BEGIN
		) {
			throw new HTTPError(
				HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
				"Invalid query range.",
			);
		}

		const RESULT: QueryResult = await POOL.query(
			`
            SELECT q.id, q.title, q.publish_time, COALESCE(a.nickname, a.username) AS publisher_name
            FROM test_schema.quest q
            JOIN test_schema.auth a ON q.publisher_id = a.id
            WHERE q.status = 1
            ORDER BY publish_time
            LIMIT $1 OFFSET $2`,
			[Math.max(QUERY_RANGE_END - QUERY_RANGE_BEGIN + 1, 1), Math.max(QUERY_RANGE_BEGIN, 0)],
		);

		res.status(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok).json(RESULT.rows);
		return;
	}),
);

/**
 * 取得題目資料
 */
ROUTER.post(
	"/getQuest",
	authenticationTokenValidation(1),
	asyncRouterErrorHandler(async (req: RequestBody<{ questID: string }>, res: Response) => {
		/**
		 * 建立虛擬機
		 */
		const ISOLATE: IsolatedVM.Isolate = new IsolatedVM.Isolate({ memoryLimit: 128 });

		try {
			/**
			 * 查詢題目內容
			 */
			const QUEST_ID: string = req.body.questID;
			const RESULT: QueryResult = await POOL.query(
				`
            SELECT code, title, question, question_var FROM test_schema.quest
            WHERE id = $1 AND status = 1`,
				[QUEST_ID],
			);

			if (RESULT.rowCount === 0) {
				throw new HTTPError(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.notFound);
			}

			const QUEST: QuestData = RESULT.rows[0];

			if (!Array.isArray(QUEST["question_var"])) {
				throw new TypeError("Database data type error.");
			}

			const CONTEXT: IsolatedVM.Context = await ISOLATE.createContext();

			QUEST["question_var"] = await Promise.all(
				QUEST["question_var"].map(async (el) => {
					if (el.type === QuestionVariableType.function) {
						const SCRIPT = await ISOLATE.compileScript(`(${el.content})()`);
						const RESULT = await SCRIPT.run(CONTEXT);
						return {
							type: el.type,
							sign: el.sign,
							content: RESULT,
						};
					}

					return el;
				}),
			);

			res.status(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok).json(RESULT.rows[0]);
			return;
		} finally {
			ISOLATE.dispose();
		}
	}),
);

/**
 * 比對題目資料中的答案，並返回結果
 */
ROUTER.post(
	"/answerQuest",
	authenticationTokenValidation(1),
	asyncRouterErrorHandler(
		async (
			req: RequestBody<{
				questID: string;
				questionVar: number[];
				answer: number[];
			}>,
			res: Response,
		) => {
			/**
			 * 建立虛擬機
			 */
			const ISOLATE: IsolatedVM.Isolate = new IsolatedVM.Isolate({ memoryLimit: 128 });

			try {
				/**
				 * 查詢解答資料
				 */
				const { questID, questionVar = [], answer = [] } = req.body;
				const RESULT: QueryResult = await POOL.query(
					"SELECT answer FROM test_schema.quest WHERE id = $1",
					[questID],
				);

				if (RESULT.rowCount === 0) {
					throw new HTTPError(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.notFound);
				}

				let answerList: Answer[] = RESULT.rows[0].answer;

				const CONTEXT: IsolatedVM.Context = await ISOLATE.createContext();
				answerList = await Promise.all(
					answerList.map(async (el) => {
						if (el.type === AnswerType.function) {
							const SCRIPT = await ISOLATE.compileScript(`(${el.content})`);
							const FN = await SCRIPT.run(CONTEXT);
							const RESULT = await FN.apply(undefined, questionVar);
							return RESULT;
						}
						if (el.type === AnswerType.text) {
							return el.content;
						}
						return el;
					}),
				);

				/**
				 * 比對答案
				 */
				const IS_CORRECT: boolean =
					answerList.length === answer.length &&
					answerList.every((val, idx) => String(val) === String(answer[idx]));

				if (IS_CORRECT) {
					res.status(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok).json({
						isCorrect: IS_CORRECT,
						message: "正確",
					});
				} else {
					res.status(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok).json({
						isCorrect: IS_CORRECT,
						message: "錯誤",
					});
				}

				return;
			} finally {
				ISOLATE.dispose();
			}
		},
	),
);

ROUTER.post(
	"/newQuest",
	authenticationTokenValidation(100),
	asyncRouterErrorHandler(
		async (
			req: RequestBody<
				QuestData & {
					answer: { type: (typeof AnswerType)[keyof typeof AnswerType]; content: string }[];
				} & {
					tags: string[];
				}
			>,
			res: Response,
		) => {
			const REQ = req as RequestWithAuthenticationToken<
				RequestBody<
					QuestData & {
						answer: { type: (typeof AnswerType)[keyof typeof AnswerType]; content: string }[];
					} & {
						tags: string[];
					}
				>
			>;

			const {
				code: CODE,
				title: TITLE,
				question: QUESTION = [],
				question_var: QUESTION_VAR = [],
				answer: ANSWER = [],
			} = REQ.body;
			const QUESTION_LIST: Question[] = QUESTION.map((el) => new Question(el.type, el.content));
			const QUESTION_VAR_LIST: QuestionVariable[] = QUESTION_VAR.map(
				(el) => new QuestionVariable(el.type, el.sign, el.content),
			);
			const ANSWER_LIST: Answer[] = ANSWER.map((el) => new Answer(el.type, el.content));

			if (
				!(
					QUESTION_LIST.every((el) => el.type !== QuestionType.undefined) &&
					QUESTION_VAR_LIST.every((el) => el.type !== QuestionVariableType.undefined) &&
					ANSWER_LIST.every((el) => el.type !== AnswerType.undefined)
				)
			) {
				throw new HTTPError(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest, "Data error.");
			}

			const RESULT: QueryResult = await POOL.query("SELECT 1 FROM test_schema.quest WHERE code = $1", [
				CODE,
			]);

			if (RESULT.rowCount) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Duplicated question number.",
				);
			}

			await POOL.query(
				`INSERT INTO test_schema.quest 
            (code, title, question, question_var, answer, publisher_id) VALUES
            ($1, $2, $3, $4, $5, $6)`,
				[
					CODE,
					TITLE,
					JSON.stringify(QUESTION_LIST),
					JSON.stringify(QUESTION_VAR_LIST),
					JSON.stringify(ANSWER_LIST),
					REQ.authenticationToken.authenticationPayload.userID,
				],
			);

			res.sendStatus(HTTP_RESPONSE_STATUS_CODE.successfulResponse.created);
		},
	),
);

ROUTER.get("/", (_req: Request, res: Response) => {
	res.send("Quest Page.");
	return;
});
