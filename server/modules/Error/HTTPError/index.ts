import type { HTTPErrorResponse } from "./type.js";

export class HTTPError extends Error {
	private _statusCode: HTTPErrorResponse;

	public constructor(statusCode: HTTPErrorResponse, message = "") {
		super(message);
		this._statusCode = statusCode;
	}

	public get statusCode(): HTTPErrorResponse {
		return this._statusCode;
	}
}
