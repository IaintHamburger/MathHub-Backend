import express, { Router, Request, Response } from 'express'
import { pool } from '../modules/db.js'
import { QueryResult } from 'pg'
import { QuestionType, Question, QuestionVariableType, QuestionVariable, AnswerType, Answer } from '../modules/quest.js'
import { AuthTokenPayload, TokenName, validateAuthToken } from '../modules/token.js'
import { HttpError, HttpStatusCode } from '../modules/http_status_code.js'
import IsolatedVM from 'isolated-vm'

const router: Router = express.Router()

router.post('/getList', async (req: Request<{}, {}, { begin: number, end: number }>, res: Response) => {
    try {
        // Token 驗證
        const auth_payload: AuthTokenPayload = validateAuthToken(req.cookies[TokenName.AUTH])

        // 用戶組驗證
        const role_result: QueryResult = await pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'")
        if (auth_payload.role < role_result.rows[0].id) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足')
        }

        // 查詢題目資料
        const begin: number = req.body.begin
        const end: number = req.body.end

        if (isNaN(begin) || isNaN(end) || end < begin) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '查詢範圍錯誤')
        }

        const result: QueryResult = await pool.query(`
            SELECT q.id, q.title, q.publish_time, COALESCE(a.nickname, a.username) AS publisher_name
            FROM test_schema.quest q
            JOIN test_schema.auth a ON q.publisher_id = a.id
            WHERE q.status = 1
            ORDER BY publish_time
            LIMIT $1 OFFSET $2`,
            [Math.max(end - begin + 1, 1), Math.max(begin, 0)]
        )

        res.status(HttpStatusCode.SUCCESSFUL_RESPONSE.OK).json(result.rows)
    }
    catch (error) {
        console.error(error)
        if (error instanceof HttpError) {
            res.status(error.status_code).send(error.message)
            return
        }

        res.sendStatus(HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
})

// 將查詢結果以 JSON 格式傳送到前端頁面
router.post('/getQuest', async (req: Request<{}, {}, { quest_id: string }>, res: Response) => {
    const isolate: IsolatedVM.Isolate = new IsolatedVM.Isolate({ memoryLimit: 128 })

    try {
        // Token 驗證
        const auth_payload: AuthTokenPayload = validateAuthToken(req.cookies[TokenName.AUTH])

        // 用戶組驗證
        const role_result: QueryResult = await pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'")
        if (auth_payload.role < role_result.rows[0].id) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足')
        }

        // 查詢題目內容
        const quest_id: string = req.body.quest_id
        const result: QueryResult = await pool.query(`
            SELECT code, title, question, question_var FROM test_schema.quest
            WHERE id = $1 AND status = 1`,
            [quest_id]
        )

        if (result.rows.length === 0) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.NOT_FOUND, '未找到題目資料')
        }

        let quest: { code: string, title: string, question: { type: string, content: string }[], question_var: { type: string, sign: string, content: string }[] } = result.rows[0]

        const context: IsolatedVM.Context = await isolate.createContext()
        const jail = context.global
        quest.question_var = await Promise.all(
            quest.question_var.map(async (el) => {
                if (el.type === QuestionVariableType.FUNCTION) {
                    const script = await isolate.compileScript(`(${el.content})()`)
                    const result = await script.run(context)
                    return {
                        type: el.type,
                        sign: el.sign,
                        content: result
                    }
                }
                else {
                    return el
                }
            })
        )
        res.status(HttpStatusCode.SUCCESSFUL_RESPONSE.OK).json(result.rows[0])
    }
    catch (error) {
        console.error(error)
        if (error instanceof HttpError) {
            res.status(error.status_code).send(error.message)
            return
        }

        res.sendStatus(HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
    finally {
        isolate.dispose()
    }
})

// 比較題目資料中的答案，並返回結果
router.post('/answerQuest', async (req: Request<{}, {}, { quest_id: string, question_var: any[], answer: string[] }>, res: Response) => {
    const isolate: IsolatedVM.Isolate = new IsolatedVM.Isolate({ memoryLimit: 128 })

    try {
        // Token 驗證
        const auth_payload: AuthTokenPayload = validateAuthToken(req.cookies[TokenName.AUTH])

        // 用戶組驗證
        const role_result: QueryResult = await pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'")
        if (auth_payload.role < role_result.rows[0].id) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足')
        }

        // 查詢解答資料
        const { quest_id, question_var = [], answer = [] } = req.body
        const answer_result: QueryResult = await pool.query('SELECT answer FROM test_schema.quest WHERE id = $1', [quest_id])

        if (answer_result.rows.length === 0) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.NOT_FOUND, '未找到題目資料')
        }

        let answer_list: Answer[] = answer_result.rows[0].answer

        const context: IsolatedVM.Context = await isolate.createContext()
        const jail = context.global
        answer_list = await Promise.all(
            answer_list.map(async (el) => {
                if (el.type === AnswerType.FUNCTION) {
                    const script = await isolate.compileScript(`(${el.content})`)
                    const fn = await script.run(context)
                    const result = await fn.apply(undefined, question_var.map(value => new IsolatedVM.ExternalCopy(value).copyInto()))
                    return result
                }
                else if (el.type === AnswerType.TEXT) {
                    return el.content
                }
            })
        )

        // 比對答案
        const is_correct = answer_list.length === answer.length && answer_list.every((val, idx) => String(val) === String(answer[idx]));

        if (is_correct) {
            res.status(HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send('回答正確')
        }
        else {
            res.status(HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send('回答錯誤')
        }

        return
    }
    catch (error) {
        console.error(error)
        if (error instanceof HttpError) {
            res.status(error.status_code).send(error.message)
            return
        }

        res.sendStatus(HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
    finally {
        isolate.dispose()
    }
})

router.post('/newQuest', async (req: Request<{}, {}, { code: string, title: string, question: { type: string, content: string }[], question_var: { type: string, sign: string, content: string }[], answer: { type: string, content: string }[], tags: string[] }>, res: Response) => {
    try {
        // Token 驗證
        const auth_payload: AuthTokenPayload = validateAuthToken(req.cookies[TokenName.AUTH])

        // 用戶組驗證
        const admin_role_result: QueryResult = await pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '管理員'")
        if (auth_payload.role < admin_role_result.rows[0].id) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足')
        }

        // 檢查題目資料
        const { code, title, question = [], question_var = [], answer = [] } = req.body
        const question_list: Question[] = question.map(el => new Question(el.type, el.content))
        const question_var_list: QuestionVariable[] = question_var.map(el => new QuestionVariable(el.type, el.sign, el.content))
        const answer_list: Answer[] = answer.map(el => new Answer(el.type, el.content))

        if (
            !question_list.every(el => el.type !== QuestionType.UNDEFINED) ||
            !question_var_list.every(el => el.type !== QuestionVariableType.UNDEFINED) ||
            !answer_list.every(el => el.type !== AnswerType.UNDEFINED)
        ) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤')
        }

        // 題目編號重複檢查
        const result: QueryResult = await pool.query('SELECT 1 FROM test_schema.quest WHERE code = $1', [code])
        if (result.rows.length > 0) {
            throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '重複編號')
        }

        await pool.query(
            `INSERT INTO test_schema.quest 
            (code, title, question, question_var, answer, publisher_id) VALUES
            ($1, $2, $3, $4, $5, (SELECT id FROM test_schema.auth WHERE username = $6))`,
            [
                code,
                title,
                JSON.stringify(question_list),
                JSON.stringify(question_var_list),
                JSON.stringify(answer_list),
                auth_payload.username
            ]
        )

        res.sendStatus(HttpStatusCode.SUCCESSFUL_RESPONSE.CREATED)
    }
    catch (error) {
        console.error(error)
        if (error instanceof HttpError) {
            res.status(error.status_code).send(error.message)
            return
        }

        res.sendStatus(HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    }
})

router.get("/", (req: Request, res: Response) => {
    res.send("Quest Page")
})

export default router