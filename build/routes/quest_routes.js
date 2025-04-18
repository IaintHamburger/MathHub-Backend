"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = require("../modules/db.js");
const router = express_1.default.Router();
router.get('/getList', async (req, res) => {
    try {
        const begin = req.query.begin ? parseInt(req.query.begin) : 0;
        const end = req.query.end ? parseInt(req.query.end) : 10;
        if (isNaN(begin) || isNaN(end) || end < begin) {
            throw new Error("Invalid query parameters.");
        }
        const result = await db_js_1.pool.query('SELECT ID, TITLE, TAGS, PUBLISHER, PUBLISH_TIME FROM QUEST ORDER BY PUBLISH_TIME LIMIT $1 OFFSET $2', [Math.max(end - begin + 1, 1), Math.max(begin, 0)]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(404).send(error);
    }
});
// questId 使用 postgreSQL 的 uuid_generate_v4() 函數自動產生
// 根據 questId 查詢擁有相應 ID 的資料 (題目)，查詢資料的 ID, TITLE, QUESTION 欄位值
// 將查詢結果以 JSON 格式傳送到前端頁面
// URL 範例: http://localhost:5001/quest/getQuest/e7325139-0266-475c-a5ab-d4e3dbf524ff
router.get('/getQuest/:questId', async (req, res) => {
    try {
        const questId = req.params.questId;
        const result = await db_js_1.pool.query('SELECT TITLE, QUESTION FROM QUEST WHERE ID = $1', [questId]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(404).send(error);
    }
});
// 使用 query string 方法傳送解答到後端伺服器
// 比較題目資料中的答案，並返回結果
// URL 範例: http://localhost:5001/quest/answerQuest/e7325139-0266-475c-a5ab-d4e3dbf524ff?answer=2
// 建議: 使用 POST 方法取得解答較有彈性
router.get('/answerQuest/:questId', async (req, res) => {
    try {
        const questId = req.params.questId;
        const user_answer = req.query.answer;
        const result = await db_js_1.pool.query('SELECT ANSWER FROM QUEST WHERE ID = $1', [questId]);
        const quest_answer = result.rows[0];
        if (user_answer === quest_answer.answer) {
            res.status(200).send('正確');
        }
        else {
            res.status(200).send('錯誤');
        }
    }
    catch (error) {
        console.error(error);
        res.status(404).send(error);
    }
});
router.get("/", (req, res) => {
    res.send("Quest Page");
});
exports.default = router;
