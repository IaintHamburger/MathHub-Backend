import crypto from "node:crypto";
import { Key } from "./Key.js";
import type { Payload } from "./Payload.js";

export class Token {
	private _header: string;
	private _payload: string;
	private _signature: string;

	// TO Redis
	protected static key: Key = Key.generateKey();
	protected static header: string = Buffer.from(
		JSON.stringify({
			alg: "RS256",
			typ: "JWT",
		}),
	).toString("base64url");

	public constructor(header: string, payload: string, signature: string) {
		this._header = header;
		this._payload = payload;
		this._signature = signature;
	}

	/**
	 * @description 根據 `Payload` 物件建立 `Token` 物件
	 * @param payload Token 負載資料 `Payload` 物件
	 * @returns Token 物件
	 */
	public static createFromPayload(payload: Payload): Token {
		const PAYLOAD: string = Buffer.from(payload.toString()).toString("base64url");
		const SIGNATURE: string = crypto
			.sign("sha256", Buffer.from(`${Token.header}.${PAYLOAD}`), {
				key: Token.key.privateKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
			})
			.toString("base64url");
		return new Token(Token.header, PAYLOAD, SIGNATURE);
	}

	/**
	 * @description 根據 Token 字串建立 `Token` 物件
	 * @param tokenString Token 字串
	 * @returns Token 物件
	 */
	public static createFromTokenString(tokenString: string): Token {
		const TOKEN_STRING: string[] = tokenString.split(".");
		if (TOKEN_STRING.length !== 3) {
			throw new Error("Invalid token string.");
		}
		const [HEADER, PAYLOAD, SIGNATURE] = TOKEN_STRING;
		return new Token(HEADER, PAYLOAD, SIGNATURE);
	}

	/**
	 * @description 驗證 `Token` 物件是否有效
	 * @param token Token 物件
	 */
	public static isValidToken(token: Token): boolean {
		if (!(token.header && token.payload && token.signature)) {
			return false;
		}

		return crypto.verify(
			"sha256",
			Buffer.from(`${token.header}.${token.payload}`),
			{
				key: Token.key.publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
			},
			Buffer.from(token.signature, "base64url"),
		);
	}

	public get header(): string {
		if (!this._header?.trim()) {
			return "";
		}
		return this._header;
	}

	public get payload(): string {
		if (!this._payload?.trim()) {
			return "";
		}
		return this._payload;
	}

	public get signature(): string {
		if (!this._signature?.trim()) {
			return "";
		}
		return this._signature;
	}

	/**
	 * @description 輸出 Token 字串
	 * @returns Token 字串
	 */
	public toString(): string {
		return `${this.header}.${this.payload}.${this.signature}`;
	}
}
