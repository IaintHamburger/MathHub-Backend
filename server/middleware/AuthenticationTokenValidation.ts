import type { Request, Response, NextFunction } from "express";
import { TokenName } from "../modules/Constant/Token/Name.js";
import { AuthenticationToken } from "../modules/Security/Authentication/AuthenticationToken.js";
import { HTTP_RESPONSE_STATUS_CODE } from "../modules/Constant/HTTPResponseStatusCode/index.js";
import type { RequestWithAuthenticationToken } from "../types/Request/type.js";

/**
 * @description 驗證 Authentication Token 的中介軟體
 * @param allowedPrivilege 允許的權限等級
 */
export function authenticationTokenValidation(
	allowedPrivilege: number,
): (req: Request, res: Response, next: NextFunction) => void {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			const AUTHENTICATION_TOKEN_STRING: string = req.cookies[TokenName.authenticationToken];

			if (!AUTHENTICATION_TOKEN_STRING?.trim()) {
				res.sendStatus(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.unauthorized);
				return;
			}

			const AUTHENTICATION_TOKEN: AuthenticationToken =
				AuthenticationToken.createFromTokenString(AUTHENTICATION_TOKEN_STRING);

			if (!AuthenticationToken.isValidToken(AUTHENTICATION_TOKEN)) {
				res.sendStatus(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.unauthorized);
				return;
			}

			if (AUTHENTICATION_TOKEN.isExpired()) {
				res.sendStatus(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.unauthorized);
				return;
			}

			if (AUTHENTICATION_TOKEN.authenticationPayload.privilege < allowedPrivilege) {
				res.sendStatus(HTTP_RESPONSE_STATUS_CODE.clientErrorResponse.forbidden);
				return;
			}

			(req as RequestWithAuthenticationToken).authenticationToken = AUTHENTICATION_TOKEN;

			next();
		} catch (error) {
			next(error);
		}
	};
}
