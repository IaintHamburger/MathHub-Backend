import { Payload } from "../Token/Payload.js";

export class AuthenticationPayload extends Payload {
	/**
	 * @description 用戶 ID
	 */
	private _userID: string;
	/**
	 * @description 用戶權限等級
	 */
	private _privilege: number;
	/**
	 * @description Token 失效時間
	 */
	private _expiresTime: number;

	public constructor(userID: string, privilege: number, expiresTime: number) {
		super();
		this._userID = userID;
		this._privilege = privilege;
		this._expiresTime = expiresTime;
	}

	public get userID(): string {
		return this._userID;
	}

	public get privilege(): number {
		return this._privilege;
	}

	public get expiresTime(): number {
		return this._expiresTime;
	}
}
