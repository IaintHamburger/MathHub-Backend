"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = require("../modules/db.js");
const quest_js_1 = require("../modules/quest.js");
const token_js_1 = require("../modules/token.js");
const http_status_code_js_1 = require("../modules/http_status_code.js");
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const router = express_1.default.Router();
router.post('/getList', async (req, res) => {
    try {
        // Token 驗證
        const auth_payload = (0, token_js_1.validateAuthToken)(req.cookies[token_js_1.TokenName.AUTH]);
        // 用戶組驗證
        const role_result = await db_js_1.pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'");
        if (auth_payload.role < role_result.rows[0].id) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足');
        }
        // 查詢題目資料
        const begin = req.body.begin;
        const end = req.body.end;
        if (isNaN(begin) || isNaN(end) || end < begin) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '查詢範圍錯誤');
        }
        const result = await db_js_1.pool.query(`
            SELECT q.id, q.title, q.publish_time, COALESCE(a.nickname, a.username) AS publisher_name
            FROM test_schema.quest q
            JOIN test_schema.auth a ON q.publisher_id = a.id
            WHERE q.status = 1
            ORDER BY publish_time
            LIMIT $1 OFFSET $2`, [Math.max(end - begin + 1, 1), Math.max(begin, 0)]);
        res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).json(result.rows);
    }
    catch (error) {
        console.error(error);
        if (error instanceof http_status_code_js_1.HttpError) {
            res.status(error.status_code).send(error.message);
            return;
        }
        res.sendStatus(http_status_code_js_1.HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
});
// 將查詢結果以 JSON 格式傳送到前端頁面
router.post('/getQuest', async (req, res) => {
    const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: 128 });
    try {
        // Token 驗證
        const auth_payload = (0, token_js_1.validateAuthToken)(req.cookies[token_js_1.TokenName.AUTH]);
        // 用戶組驗證
        const role_result = await db_js_1.pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'");
        if (auth_payload.role < role_result.rows[0].id) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足');
        }
        // 查詢題目內容
        const quest_id = req.body.quest_id;
        const result = await db_js_1.pool.query(`
            SELECT code, title, question, question_var FROM test_schema.quest
            WHERE id = $1 AND status = 1`, [quest_id]);
        if (result.rows.length === 0) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.NOT_FOUND, '未找到題目資料');
        }
        let quest = result.rows[0];
        const context = await isolate.createContext();
        const jail = context.global;
        quest.question_var = await Promise.all(quest.question_var.map(async (el) => {
            if (el.type === quest_js_1.QuestionVariableType.FUNCTION) {
                const script = await isolate.compileScript(`(${el.content})()`);
                const result = await script.run(context);
                return {
                    type: el.type,
                    sign: el.sign,
                    content: result
                };
            }
            else {
                return el;
            }
        }));
        res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        if (error instanceof http_status_code_js_1.HttpError) {
            res.status(error.status_code).send(error.message);
            return;
        }
        res.sendStatus(http_status_code_js_1.HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
    finally {
        isolate.dispose();
    }
});
// 比較題目資料中的答案，並返回結果
router.post('/answerQuest', async (req, res) => {
    const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: 128 });
    try {
        // Token 驗證
        const auth_payload = (0, token_js_1.validateAuthToken)(req.cookies[token_js_1.TokenName.AUTH]);
        // 用戶組驗證
        const role_result = await db_js_1.pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '一般使用者'");
        if (auth_payload.role < role_result.rows[0].id) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足');
        }
        // 查詢解答資料
        const { quest_id, question_var = [], answer = [] } = req.body;
        const answer_result = await db_js_1.pool.query('SELECT answer FROM test_schema.quest WHERE id = $1', [quest_id]);
        if (answer_result.rows.length === 0) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.NOT_FOUND, '未找到題目資料');
        }
        let answer_list = answer_result.rows[0].answer;
        const context = await isolate.createContext();
        const jail = context.global;
        answer_list = await Promise.all(answer_list.map(async (el) => {
            if (el.type === quest_js_1.AnswerType.FUNCTION) {
                const script = await isolate.compileScript(`(${el.content})`);
                const fn = await script.run(context);
                const result = await fn.apply(undefined, question_var.map(value => new isolated_vm_1.default.ExternalCopy(value).copyInto()));
                return result;
            }
            else if (el.type === quest_js_1.AnswerType.TEXT) {
                return el.content;
            }
        }));
        // 比對答案
        const is_correct = answer_list.length === answer.length && answer_list.every((val, idx) => String(val) === String(answer[idx]));
        if (is_correct) {
            res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send('回答正確');
        }
        else {
            res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send('回答錯誤');
        }
        return;
    }
    catch (error) {
        console.error(error);
        if (error instanceof http_status_code_js_1.HttpError) {
            res.status(error.status_code).send(error.message);
            return;
        }
        res.sendStatus(http_status_code_js_1.HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
    finally {
        isolate.dispose();
    }
});
router.post('/newQuest', async (req, res) => {
    try {
        // Token 驗證
        const auth_payload = (0, token_js_1.validateAuthToken)(req.cookies[token_js_1.TokenName.AUTH]);
        // 用戶組驗證
        const admin_role_result = await db_js_1.pool.query("SELECT id FROM test_schema.auth_role_type WHERE name = '管理員'");
        if (auth_payload.role < admin_role_result.rows[0].id) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.FORBIDDEN, '用戶權限不足');
        }
        // 檢查題目資料
        const { code, title, question = [], question_var = [], answer = [] } = req.body;
        const question_list = question.map(el => new quest_js_1.Question(el.type, el.content));
        const question_var_list = question_var.map(el => new quest_js_1.QuestionVariable(el.type, el.sign, el.content));
        const answer_list = answer.map(el => new quest_js_1.Answer(el.type, el.content));
        if (!question_list.every(el => el.type !== quest_js_1.QuestionType.UNDEFINED) ||
            !question_var_list.every(el => el.type !== quest_js_1.QuestionVariableType.UNDEFINED) ||
            !answer_list.every(el => el.type !== quest_js_1.AnswerType.UNDEFINED)) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤');
        }
        // 題目編號重複檢查
        const result = await db_js_1.pool.query('SELECT 1 FROM test_schema.quest WHERE code = $1', [code]);
        if (result.rows.length > 0) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '重複編號');
        }
        await db_js_1.pool.query(`INSERT INTO test_schema.quest 
            (code, title, question, question_var, answer, publisher_id) VALUES
            ($1, $2, $3, $4, $5, (SELECT id FROM test_schema.auth WHERE username = $6))`, [
            code,
            title,
            JSON.stringify(question_list),
            JSON.stringify(question_var_list),
            JSON.stringify(answer_list),
            auth_payload.username
        ]);
        res.sendStatus(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.CREATED);
    }
    catch (error) {
        console.error(error);
        if (error instanceof http_status_code_js_1.HttpError) {
            res.status(error.status_code).send(error.message);
            return;
        }
        res.sendStatus(http_status_code_js_1.HttpStatusCode.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
});
router.get("/", (req, res) => {
    res.send("Quest Page");
});
exports.default = router;
