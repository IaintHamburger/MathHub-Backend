import type { InformationResponse, SuccessfulResponse, RedirectionMessage, ClientErrorResponse, ServerErrorResponse, HTTPResponse } from "./type.js";

const INFORMATION_RESPONSE: InformationResponse = {
	continue: 100,
	switchingProtocols: 101,
	processing: 102,
	earlyHints: 103,
} as const;

const SUCCESSFUL_RESPONSE: SuccessfulResponse = {
	ok: 200,
	created: 201,
	accepted: 202,
	nonAuthoritativeInformation: 203,
	noContent: 204,
	resetContent: 205,
	partialContent: 206,
	multiStatus: 207,
	alreadyReported: 208,
	imUsed: 226,
} as const;

const REDIRECTION_MESSAGE: RedirectionMessage = {
	multipleChoices: 300,
	movedPermanently: 301,
	found: 302,
	seeOther: 303,
	notModified: 304,
	useProxy: 305,
	unused: 306,
	temporaryRedirect: 307,
	permanentRedirect: 308,
} as const;

export const CLIENT_ERROR_RESPONSE: ClientErrorResponse = {
	badRequest: 400,
	unauthorized: 401,
	paymentRequired: 402,
	forbidden: 403,
	notFound: 404,
	methodNotAllowed: 405,
	notAcceptable: 406,
	proxyAuthenticationRequired: 407,
	requestTimeout: 408,
	conflict: 409,
	gone: 410,
	lengthRequired: 411,
	preconditionFailed: 412,
	payloadTooLarge: 413,
	uriTooLong: 414,
	unsupportedMediaType: 415,
	rangeNotSatisfiable: 416,
	expectationFailed: 417,
	imATeapot: 418,
	misdirectedRequest: 421,
	unprocessableContent: 422,
	locked: 423,
	failedDependency: 424,
	tooEarly: 425,
	upgradeRequired: 426,
	preconditionRequired: 428,
	tooManyRequests: 429,
	requestHeaderFieldsTooLarge: 431,
	unavailableForLegalReasons: 451,
} as const;

export const SERVER_ERROR_RESPONSE: ServerErrorResponse = {
	internalServerError: 500,
	notImplemented: 501,
	badGateway: 502,
	serviceUnavailable: 503,
	gatewayTimeout: 504,
	httpVersionNotSupported: 505,
	variantAlsoNegotiates: 506,
	insufficientStorage: 507,
	loopDetected: 508,
	notExtended: 510,
	networkAuthenticationRequired: 511,
} as const;

/**
 * @description HTTP 回應狀態碼物件
 */
export const HTTP_RESPONSE_STATUS_CODE: HTTPResponse = {
	informationResponse: INFORMATION_RESPONSE,
	successfulResponse: SUCCESSFUL_RESPONSE,
	redirectionMessage: REDIRECTION_MESSAGE,
	clientErrorResponse: CLIENT_ERROR_RESPONSE,
	serverErrorResponse: SERVER_ERROR_RESPONSE,
} as const;
