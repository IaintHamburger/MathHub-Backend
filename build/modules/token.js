"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenPayload = exports.TokenPayload = exports.TokenName = exports.PayloadType = void 0;
exports.createRSAToken = createRSAToken;
exports.parseRSAToken = parseRSAToken;
exports.verifyRSAToken = verifyRSAToken;
exports.validateAuthToken = validateAuthToken;
const node_crypto_1 = __importDefault(require("node:crypto"));
const http_status_code_1 = require("./http_status_code");
/** @description 定義負載資料的種類 */
var PayloadType;
(function (PayloadType) {
    /** @description 用戶驗證資料 */
    PayloadType["AUTH"] = "AUTH";
    /** @description 未定義資料 */
    PayloadType["UNDEFINED"] = "UNDEF";
})(PayloadType || (exports.PayloadType = PayloadType = {}));
var TokenName;
(function (TokenName) {
    /** @description 用戶 Token */
    TokenName["AUTH"] = "auth_token";
})(TokenName || (exports.TokenName = TokenName = {}));
class TokenPayload {
    /** @description 負載種類 */
    type;
    constructor(type) {
        this.type = type;
    }
    /** @description 負載資料物件轉換為字串 */
    toString() {
        return JSON.stringify(this);
    }
    /** @description 根據`type`值解析為對應類型的負載資料物件 */
    static parsePayload(payload) {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
        switch (data['type']) {
            case PayloadType.AUTH:
                return new AuthTokenPayload(data['username'], data['role'], data['expires_time']);
            default:
                return new TokenPayload(PayloadType.UNDEFINED);
        }
    }
}
exports.TokenPayload = TokenPayload;
/** @description 用戶 Token 資料 */
class AuthTokenPayload extends TokenPayload {
    /** @description 用戶名稱 */
    username;
    /** @description 用戶組 */
    role;
    /** @description 失效時間 */
    expires_time;
    constructor(username, role, expires_time) {
        super(PayloadType.AUTH);
        this.username = username;
        this.role = role;
        this.expires_time = expires_time;
    }
}
exports.AuthTokenPayload = AuthTokenPayload;
const { publicKey, privateKey } = node_crypto_1.default.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});
/** @description 建立 Token 字串 */
function createRSAToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const encoded_payload = Buffer.from(payload.toString()).toString('base64url');
    const signature = node_crypto_1.default.sign("sha256", Buffer.from(`${header}.${encoded_payload}`), { key: privateKey, padding: node_crypto_1.default.constants.RSA_PKCS1_PSS_PADDING }).toString('base64url');
    return `${header}.${encoded_payload}.${signature}`;
}
/** @description 解析 Token 字串 */
function parseRSAToken(token) {
    const [header, payload, signature] = token.split('.');
    const token_payload = TokenPayload.parsePayload(payload);
    return { header, token_payload, signature };
}
/** @description 檢查 Token 是否有效 */
function verifyRSAToken(token) {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
        return false;
    }
    return node_crypto_1.default.verify('sha256', Buffer.from(`${header}.${payload}`), { key: publicKey, padding: node_crypto_1.default.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, 'base64url'));
}
/** @description 驗證`auth_token` cookie並建構`AuthTokenPayload`物件 */
function validateAuthToken(token) {
    if (!token || !verifyRSAToken(token)) {
        throw new http_status_code_1.HttpError(http_status_code_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤');
    }
    const auth_token = parseRSAToken(token);
    if (auth_token.token_payload.type !== PayloadType.AUTH || !(auth_token.token_payload instanceof AuthTokenPayload)) {
        throw new http_status_code_1.HttpError(http_status_code_1.HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤');
    }
    return auth_token.token_payload;
}
