import type { Request, Response, NextFunction } from "express";
import { HTTPError } from "../modules/Error/HTTPError/index.js";
import { HTTP_RESPONSE_STATUS_CODE } from "../modules/Constant/HTTPResponseStatusCode/index.js";

// biome-ignore lint/suspicious/noExplicitAny: The use of type "any" is required by middleware definition.
export function routerErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
	console.error(err);

	if (err instanceof HTTPError) {
		res.status(err.statusCode).send(err.message);
	} else {
		res.sendStatus(HTTP_RESPONSE_STATUS_CODE.serverErrorResponse.internalServerError);
	}

	return;
}
