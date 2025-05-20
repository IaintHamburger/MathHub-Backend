import type { HTTP_RESPONSE_STATUS_CODE } from "../../Constant/HTTPResponseStatusCode/index.js";

export type HTTPErrorResponse =
	| (typeof HTTP_RESPONSE_STATUS_CODE.clientErrorResponse)[keyof typeof HTTP_RESPONSE_STATUS_CODE.clientErrorResponse]
	| (typeof HTTP_RESPONSE_STATUS_CODE.serverErrorResponse)[keyof typeof HTTP_RESPONSE_STATUS_CODE.serverErrorResponse];
