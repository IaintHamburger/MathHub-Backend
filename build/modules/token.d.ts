/** @description 定義負載資料的種類 */
export declare enum PayloadType {
    /** @description 用戶驗證資料 */
    AUTH = "AUTH",
    /** @description 未定義資料 */
    UNDEFINED = "UNDEF"
}
export declare enum TokenName {
    /** @description 用戶 Token */
    AUTH = "auth_token"
}
export type TokenPayloadUnion = TokenPayload | AuthTokenPayload;
export declare class TokenPayload {
    /** @description 負載種類 */
    type: PayloadType;
    constructor(type: PayloadType);
    /** @description 負載資料物件轉換為字串 */
    toString(): string;
    /** @description 根據`type`值解析為對應類型的負載資料物件 */
    static parsePayload(payload: string): TokenPayloadUnion;
}
/** @description 用戶 Token 資料 */
export declare class AuthTokenPayload extends TokenPayload {
    /** @description 用戶名稱 */
    username: string;
    /** @description 用戶組 */
    role: number;
    /** @description 失效時間 */
    expires_time: number;
    constructor(username: string, role: number, expires_time: number);
}
/** @description 建立 Token 字串 */
export declare function createRSAToken(payload: TokenPayload): string;
/** @description 解析 Token 字串 */
export declare function parseRSAToken(token: string): {
    header: string;
    token_payload: TokenPayloadUnion;
    signature: string;
};
/** @description 檢查 Token 是否有效 */
export declare function verifyRSAToken(token: string): boolean;
/** @description 驗證`auth_token` cookie並建構`AuthTokenPayload`物件 */
export declare function validateAuthToken(token: any): AuthTokenPayload;
