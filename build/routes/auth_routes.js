"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = require("../modules/db.js");
const node_crypto_1 = __importDefault(require("node:crypto"));
const token_js_1 = require("../modules/token.js");
const http_status_code_js_1 = require("../modules/http_status_code.js");
const router = express_1.default.Router();
// 新用戶註冊函式
// 先檢查資料庫中是否存在重複的用戶名稱，之後再將密碼進行雜湊處理後寫入資料庫
// 最後將 auth_token 傳送到前端，供後續的身份驗證使用
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // 驗證用戶名稱和密碼格式
        const username_valid_format = /^[a-zA-Z0-9](?:[a-zA-Z0-9_]{3,62})[a-zA-Z0-9]$/; // 英文字母、數字、底線組成用戶名稱，其中開頭和結尾不可以是底線，最短5位、最長64位
        const password_valid_format = /^(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@^_`{|}~]{8,64}$/; // 英文字母和數字組成密碼，至少有一個大寫英文字母、一個特殊字元，最短8位、最長64位
        if (!username_valid_format.test(username) || !password_valid_format.test(password)) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '用戶名稱或密碼格式不正確');
        }
        const auth_username = await db_js_1.pool.query('SELECT username FROM test_schema.auth WHERE username = $1', [username]);
        if (auth_username.rows.length > 0) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '用戶名稱已存在');
        }
        const salt = node_crypto_1.default.randomBytes(16).toString('hex');
        const hashed_password = node_crypto_1.default.pbkdf2Sync(password, salt, 100_000, 64, 'sha512');
        await db_js_1.pool.query('INSERT INTO test_schema.auth (username, password, salt) VALUES ($1, $2, $3)', [username, hashed_password, salt]);
        const auth_data = await db_js_1.pool.query('SELECT role FROM test_schema.auth WHERE username = $1', [username]);
        /** @description 有效時間長度，單位為秒 */
        const expires_in = 86_400;
        const payload = new token_js_1.AuthTokenPayload(username, auth_data.rows[0]['role'], Math.floor(Date.now() + expires_in * 1000));
        const auth_token = (0, token_js_1.createRSAToken)(payload);
        res.cookie(token_js_1.TokenName.AUTH, auth_token, {
            'httpOnly': true,
            // 'secure': true, // 只在 HTTPS 下傳輸
            'sameSite': 'strict',
            'maxAge': expires_in * 1000
        });
        res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.CREATED).send('註冊成功');
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
// 用戶登入函式
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const auth_data = await db_js_1.pool.query('SELECT password, salt, role FROM test_schema.auth WHERE username = $1', [username]);
        if (auth_data.rows.length === 0) {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '帳號或密碼錯誤');
        }
        const salt = auth_data.rows[0]['salt'];
        const hashed_password = auth_data.rows[0]['password'];
        const hashed_input_password = node_crypto_1.default.pbkdf2Sync(password, salt, 100_000, 64, 'sha512');
        const is_password_valid = node_crypto_1.default.timingSafeEqual(hashed_input_password, hashed_password);
        if (is_password_valid) {
            /** @description 有效時間長度，單位為秒 */
            const expires_in = 86_400;
            const payload = new token_js_1.AuthTokenPayload(username, auth_data.rows[0]['role'], Math.floor(Date.now() + expires_in * 1000));
            const token = (0, token_js_1.createRSAToken)(payload);
            res.cookie(token_js_1.TokenName.AUTH, token, {
                'httpOnly': true,
                // 'secure': true, // 只在 HTTPS 下傳輸
                'sameSite': 'strict',
                'maxAge': expires_in * 1000
            });
            res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send('登入成功');
            return;
        }
        else {
            throw new http_status_code_js_1.HttpError(http_status_code_js_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '帳號或密碼錯誤');
        }
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
// 檢查 auth_token 函式
// 正式環境可以移除此函式
router.post('/verify', (req, res) => {
    try {
        const auth_payload = (0, token_js_1.validateAuthToken)(req.cookies[token_js_1.TokenName.AUTH]);
        res.status(http_status_code_js_1.HttpStatusCode.SUCCESSFUL_RESPONSE.OK).send(token_js_1.AuthTokenPayload.toString());
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
exports.default = router;
