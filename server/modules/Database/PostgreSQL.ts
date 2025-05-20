import { CONFIGURATION } from "../../config/PostgreSQLConfiguration/index.js";
import { Pool } from "pg";

/**
 * @description PostgreSQL 連線池
 */
export const POOL: Pool = new Pool(CONFIGURATION);

/**
 * @description 關閉資料庫連線
 */
export async function disconnect(): Promise<void> {
	console.log(`Disconnecting database "${CONFIGURATION.host}"...`);
	await POOL.end();
	console.log(`Disconnected database "${CONFIGURATION.host}".`);
}
