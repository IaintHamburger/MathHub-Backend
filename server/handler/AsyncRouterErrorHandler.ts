import type { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncRouterErrorHandler<T extends Request, U extends Response>(
	handler: (req: T, res: U, next: NextFunction) => Promise<void>,
): RequestHandler {
	return (req, res, next): void => {
		handler(req as T, res as U, next).catch(next);
	};
}
