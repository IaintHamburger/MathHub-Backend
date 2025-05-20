import express, { type Router, type Request, type Response } from "express";
import type { RequestBody, RequestWithAuthenticationToken } from "../types/Request/type.js";
import { asyncRouterErrorHandler } from "../handler/AsyncRouterErrorHandler.js";
import { HTTPError } from "../modules/Error/HTTPError/index.js";
import { HTTP_RESPONSE_STATUS_CODE } from "../modules/Constant/HTTPResponseStatusCode/index.js";
import type { QueryResult } from "pg";
import { POOL } from "../modules/Database/PostgreSQL.js";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { AuthenticationPayload } from "../modules/Security/Authentication/AuthenticationPayload.js";
import { AuthenticationToken } from "../modules/Security/Authentication/AuthenticationToken.js";
import { TokenName } from "../modules/Constant/Token/Name.js";
import { authenticationTokenValidation } from "../middleware/AuthenticationTokenValidation.js";

export const ROUTER: Router = express.Router();

/**
 * 有效用戶名稱格式
 * 英文字母、數字、底線組成用戶名稱，其中開頭和結尾不可以是底線，最短5位、最長64位
 */
const USERNAME_FORMAT: RegExp = /^[a-zA-Z0-9](?:[a-zA-Z0-9_]{3,62})[a-zA-Z0-9]$/;
/**
 * 有效密碼格式
 */
const PASSWORD_FORMAT: RegExp =
	/^(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@^_`{|}~]{8,64}$/;

const PROMISIFY_PBKDF2 = promisify(crypto.pbkdf2);

/**
 * 新用戶註冊函式
 * 先檢查資料庫中是否存在重複的用戶名稱，接著在將密碼進行雜湊處理後寫入資料庫
 * 最後將 Authentication-Token 傳送到前端，供後續的身分驗證使用
 */
ROUTER.post(
	"/register",
	asyncRouterErrorHandler(
		async (req: RequestBody<{ username: string; password: string }>, res: Response) => {
			const { username: USERNAME, password: PASSWORD } = req.body;

			/**
			 * 驗證用戶名稱和密碼格式
			 */
			if (!(USERNAME_FORMAT.test(USERNAME) && PASSWORD_FORMAT.test(PASSWORD))) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Invalid username or password format.",
				);
			}

			const RESULT: QueryResult = await POOL.query(
				"SELECT username FROM test_schema.auth WHERE username = $1",
				[USERNAME],
			);

			if (RESULT.rowCount) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Username already existed.",
				);
			}

			const SALT: string = crypto.randomBytes(16).toString("hex");
			const HASHED_PASSWORD: Buffer = await PROMISIFY_PBKDF2(PASSWORD, SALT, 100_000, 64, "sha512");

			await POOL.query("INSERT INTO test_schema.auth (username, password, salt) VALUES ($1, $2, $3)", [
				USERNAME,
				HASHED_PASSWORD,
				SALT,
			]);

			res.sendStatus(HTTP_RESPONSE_STATUS_CODE.successfulResponse.created);
		},
	),
);

ROUTER.post(
	"/login",
	asyncRouterErrorHandler(
		async (req: RequestBody<{ username: string; password: string }>, res: Response) => {
			const { username: USERNAME, password: PASSWORD } = req.body;

			/**
			 * 驗證用戶名稱和密碼格式
			 */
			if (!(USERNAME_FORMAT.test(USERNAME) && PASSWORD_FORMAT.test(PASSWORD))) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Invalid username or password.",
				);
			}

			const RESULT: QueryResult = await POOL.query(
				"SELECT id, password, salt, role FROM test_schema.auth WHERE username = $1",
				[USERNAME],
			);
			if (RESULT.rowCount === 0) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Invalid username or password.",
				);
			}

			const SALT: string = RESULT.rows[0]["salt"];
			const HASHED_PASSWORD: Buffer = RESULT.rows[0]["password"];
			const HASHED_INPUT_PASSWORD: Buffer = await PROMISIFY_PBKDF2(
				PASSWORD,
				SALT,
				100_000,
				64,
				"sha512",
			);

			const IS_PASSWORD_VALID: boolean = crypto.timingSafeEqual(HASHED_INPUT_PASSWORD, HASHED_PASSWORD);

			if (!IS_PASSWORD_VALID) {
				throw new HTTPError(
					HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.badRequest,
					"Invalid username or password.",
				);
			}

			/**
			 * 有效時間長度，單位為秒
			 */
			const EXPIRES_IN: number = 86_400;
			const PAYLOAD: AuthenticationPayload = new AuthenticationPayload(
				RESULT.rows[0]["id"],
				RESULT.rows[0]["role"],
				Math.floor(Date.now() + EXPIRES_IN * 1000),
			);
			const TOKEN: AuthenticationToken = AuthenticationToken.createFromPayload(PAYLOAD);

			res.cookie(TokenName.authenticationToken, TOKEN.toString(), {
				httpOnly: true,
				// secure: true,    // 只在 HTTPS 下傳輸
				sameSite: "strict",
				maxAge: EXPIRES_IN * 1000,
			}).sendStatus(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok);
		},
	),
);

/**
 * 檢查 Authentication-Token 的函式
 * 正式環境可以移除此函式
 */
ROUTER.post("/validate/authentication", authenticationTokenValidation(1), (req: Request, res: Response) => {
	const REQ: RequestWithAuthenticationToken = req as RequestWithAuthenticationToken;
	res.status(HTTP_RESPONSE_STATUS_CODE.successfulResponse.ok).send(REQ.authenticationToken.toString());
	return;
});
