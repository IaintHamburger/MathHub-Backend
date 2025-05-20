"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_js_1 = require("./config/ServerConfiguration/index.js");
const QuestRouter_js_1 = require("./router/QuestRouter.js");
const AuthenticationRouter_js_1 = require("./router/AuthenticationRouter.js");
const node_process_1 = __importDefault(require("node:process"));
const node_events_1 = require("node:events");
const index_js_2 = require("./modules/Database/index.js");
const RouterErrorHandler_js_1 = require("./middleware/RouterErrorHandler.js");
const APP = (0, express_1.default)();
APP.use((0, cors_1.default)());
APP.use(express_1.default.json());
APP.use((0, cookie_parser_1.default)());
/**
 * 模組化路由函式
 */
APP.use("/quest", QuestRouter_js_1.ROUTER);
APP.use("/auth", AuthenticationRouter_js_1.ROUTER);
APP.get("/", (_req, res) => {
    res.send("MathHub API is running...");
});
const PORT = index_js_1.CONFIGURATION.port;
const SERVER = APP.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
/**
 * 路由函式錯誤處理中介層，必須在所有中介層及路由函式之後。
 */
APP.use(RouterErrorHandler_js_1.routerErrorHandler);
/**
 * @description 伺服器終止函式
 */
async function shutdownServer() {
    console.log("Server shutting down...");
    await index_js_2.Database.postgreSQL.disconnect();
    SERVER.close();
    console.log("Server shutdown complete.");
}
/**
 * 監聽程式終止訊號，以便觸發伺服器終止程序。\
 * 使用 `EventEmitter` 確保只會觸發一次伺服器終止函式。
 */
const SHUTDOWN_EMITTER = new node_events_1.EventEmitter();
SHUTDOWN_EMITTER.once("shutdown", shutdownServer);
/**
 * Ctrl + C 終止
 */
node_process_1.default.on("SIGINT", () => SHUTDOWN_EMITTER.emit("shutdown"));
/**
 * 系統發出的終止訊號
 */
node_process_1.default.on("SIGTERM", () => SHUTDOWN_EMITTER.emit("shutdown"));
