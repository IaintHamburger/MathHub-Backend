import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { CONFIGURATION } from "./config/ServerConfiguration/index.js";
import { ROUTER as QuestRouter } from "./router/QuestRouter.js";
import { ROUTER as AuthenticationRouter } from "./router/AuthenticationRouter.js";

import process from "node:process";
import { EventEmitter } from "node:events";
import { Database } from "./modules/Database/index.js";
import { routerErrorHandler } from "./middleware/RouterErrorHandler.js";

const APP: Express = express();
APP.use(cors());
APP.use(express.json());
APP.use(cookieParser());

/**
 * 模組化路由函式
 */
APP.use("/quest", QuestRouter);
APP.use("/auth", AuthenticationRouter);

APP.get("/", (_req: Request, res: Response) => {
	res.send("MathHub API is running...");
});

const PORT: number = CONFIGURATION.port;
const SERVER = APP.listen(PORT, () => {
	console.log(`Server running on port ${PORT}...`);
});

/**
 * 路由函式錯誤處理中介層，必須在所有中介層及路由函式之後。
 */
APP.use(routerErrorHandler);

/**
 * @description 伺服器終止函式
 */
async function shutdownServer(): Promise<void> {
	console.log("Server shutting down...");

	await Database.postgreSQL.disconnect();

	SERVER.close();

	console.log("Server shutdown complete.");
}

/**
 * 監聽程式終止訊號，以便觸發伺服器終止程序。\
 * 使用 `EventEmitter` 確保只會觸發一次伺服器終止函式。
 */
const SHUTDOWN_EMITTER: EventEmitter = new EventEmitter();
SHUTDOWN_EMITTER.once("shutdown", shutdownServer);

/**
 * Ctrl + C 終止
 */
process.on("SIGINT", () => SHUTDOWN_EMITTER.emit("shutdown"));
/**
 * 系統發出的終止訊號
 */
process.on("SIGTERM", () => SHUTDOWN_EMITTER.emit("shutdown"));
