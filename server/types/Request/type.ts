import type { Request } from "express";
import type { AuthenticationToken } from "../../modules/Security/Authentication/AuthenticationToken.js";

export type RequestWithAuthenticationToken<T extends Request = Request> = T & {
	authenticationToken: AuthenticationToken;
};

// biome-ignore lint/suspicious/noExplicitAny: The use of type "any" is necessary in this type definition.
export type RequestBody<T> = Request<any, any, T>;
