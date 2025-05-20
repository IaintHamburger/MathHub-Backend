import { AuthenticationPayload } from "./AuthenticationPayload.js";
import { Token } from "../Token/Token.js";
import crypto from "node:crypto";

export class AuthenticationToken extends Token {
	private _authenticationPayload: AuthenticationPayload;

	private constructor(header: string, payload: string, signature: string) {
		super(header, payload, signature);

		const payloadObject = JSON.parse(Buffer.from(payload, "base64url").toString());
		const KEYS: string[] = Object.keys(payloadObject);

		if (!(KEYS.includes("_userID") && KEYS.includes("_privilege") && KEYS.includes("_expiresTime"))) {
			throw new Error("Invalid Authentication Token payload string.");
		}

		this._authenticationPayload = new AuthenticationPayload(
			payloadObject["_userID"],
			payloadObject["_privilege"],
			payloadObject["_expiresTime"],
		);
	}

	public static createFromPayload(payload: AuthenticationPayload): AuthenticationToken {
		const PAYLOAD: string = Buffer.from(payload.toString()).toString("base64url");
		const SIGNATURE: string = crypto
			.sign("sha256", Buffer.from(`${Token.header}.${PAYLOAD}`), {
				key: Token.key.privateKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
			})
			.toString("base64url");
		return new AuthenticationToken(Token.header, PAYLOAD, SIGNATURE);
	}

	public static createFromTokenString(tokenString: string): AuthenticationToken {
		const TOKEN_STRING: string[] = tokenString.split(".");
		if (TOKEN_STRING.length !== 3) {
			throw new Error("Invalid Authentication Token string.");
		}
		const [HEADER, PAYLOAD, SIGNATURE] = TOKEN_STRING;
		return new AuthenticationToken(HEADER, PAYLOAD, SIGNATURE);
	}

	public static isValidToken(token: AuthenticationToken): boolean {
		if (!Token.isValidToken(token)) {
			return false;
		}

		const payloadObject = JSON.parse(Buffer.from(token.payload, "base64url").toString());
		const KEYS: string[] = Object.keys(payloadObject);

		return KEYS.includes("_userID") && KEYS.includes("_privilege") && KEYS.includes("_expiresTime");
	}

	public isExpired(): boolean {
		return Date.now() >= this.authenticationPayload.expiresTime;
	}

	public get authenticationPayload(): AuthenticationPayload {
		return this._authenticationPayload;
	}
}
