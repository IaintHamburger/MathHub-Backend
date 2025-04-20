"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
const node_process_1 = __importDefault(require("node:process"));
const node_events_1 = require("node:events");
dotenv.config();
/** @description PostgreSQL 連線池 */
exports.pool = new pg_1.Pool({
    user: node_process_1.default.env.DB_USERNAME,
    host: node_process_1.default.env.DB_HOSTNAME,
    database: node_process_1.default.env.DB_NAME,
    password: node_process_1.default.env.DB_PASSWORD,
    port: parseInt(node_process_1.default.env.DB_PORT || '5432'),
    max: parseInt(node_process_1.default.env.DB_MAX_CONNECT || '10'),
    idleTimeoutMillis: parseInt(node_process_1.default.env.DB_IDLE_TIMEOUT || '60000'),
    connectionTimeoutMillis: parseInt(node_process_1.default.env.DB_CONNECT_TIMEOUT_MS || '5000')
});
/** @description 關閉資料庫連線 */
async function disconnectDatabase() {
    console.log('關閉資料庫連線...');
    await exports.pool.end();
    console.log('已成功關閉資料庫連線.');
    node_process_1.default.exit(0);
}
// 監聽程式終止訊號，關閉資料庫連線
// 使用 EventEmitter 確保只會觸發一次關閉資料庫連線函式
const shutdownEmitter = new node_events_1.EventEmitter();
shutdownEmitter.once('shutdown', disconnectDatabase);
node_process_1.default.on('SIGINT', () => shutdownEmitter.emit('shutdown')); // Ctrl + C 終止
node_process_1.default.on('SIGTERM', () => shutdownEmitter.emit('shutdown')); // 系統發出的終止訊號
node_process_1.default.on('exit', () => shutdownEmitter.emit('shutdown')); // Node.js 正常退出時執行
