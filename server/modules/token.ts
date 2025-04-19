import crypto from 'node:crypto'
import { HttpError, HttpStatusCode } from './http_status_code'

/** @description 定義負載資料的種類 */
export enum PayloadType {
    /** @description 用戶驗證資料 */
    AUTH = 'AUTH',
    /** @description 未定義資料 */
    UNDEFINED = 'UNDEF'
}

export enum TokenName {
    /** @description 用戶 Token */
    AUTH = 'auth_token'
}

export type TokenPayloadUnion = TokenPayload | AuthTokenPayload

export class TokenPayload {
    /** @description 負載種類 */
    type: PayloadType

    constructor(type: PayloadType) {
        this.type = type
    }

    /** @description 負載資料物件轉換為字串 */
    toString(): string {
        return JSON.stringify(this)
    }

    /** @description 根據`type`值解析為對應類型的負載資料物件 */
    static parsePayload(payload: string): TokenPayloadUnion {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
        switch (data['type']) {
            case PayloadType.AUTH:
                return new AuthTokenPayload(data['username'], data['role'], data['expires_time'])

            default:
                return new TokenPayload(PayloadType.UNDEFINED)
        }
    }
}

/** @description 用戶 Token 資料 */
export class AuthTokenPayload extends TokenPayload {
    /** @description 用戶名稱 */
    username: string
    /** @description 用戶組 */
    role: number
    /** @description 失效時間 */
    expires_time: number

    constructor(username: string, role: number, expires_time: number) {
        super(PayloadType.AUTH)
        this.username = username
        this.role = role
        this.expires_time = expires_time
    }
}

const { publicKey, privateKey }: { publicKey: string, privateKey: string } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
})

/** @description 建立 Token 字串 */
export function createRSAToken(payload: TokenPayload): string {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const encoded_payload = Buffer.from(payload.toString()).toString('base64url')
    const signature = crypto.sign("sha256", Buffer.from(`${header}.${encoded_payload}`), { key: privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString('base64url')
    return `${header}.${encoded_payload}.${signature}`
}

/** @description 解析 Token 字串 */
export function parseRSAToken(token: string): { header: string, token_payload: TokenPayloadUnion, signature: string } {
    const [header, payload, signature] = token.split('.')
    const token_payload: TokenPayloadUnion = TokenPayload.parsePayload(payload)
    return { header, token_payload, signature }
}

/** @description 檢查 Token 是否有效 */
export function verifyRSAToken(token: string): boolean {
    const [header, payload, signature] = token.split('.')

    if (!header || !payload || !signature) {
        return false
    }

    return crypto.verify('sha256', Buffer.from(`${header}.${payload}`), { key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, 'base64url'))
}

/** @description 驗證`auth_token` cookie並建構`AuthTokenPayload`物件 */
export function validateAuthToken(token: any): AuthTokenPayload {
    if (!token || !verifyRSAToken(token)) {
        throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤')
    }

    const auth_token = parseRSAToken(token)
    if (auth_token.token_payload.type !== PayloadType.AUTH || !(auth_token.token_payload instanceof AuthTokenPayload)) {
        throw new HttpError(HttpStatusCode.CLIENT_ERROR_RESPONSE.BAD_REQUEST, '資料錯誤')
    }

    return auth_token.token_payload
}