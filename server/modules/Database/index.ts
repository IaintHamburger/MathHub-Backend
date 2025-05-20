import { disconnect as disconnectPostgreSQLDatabase } from "./PostgreSQL.js";
import type { DatabaseType } from "./type.js";

export const Database: DatabaseType = {
    postgreSQL: {
        disconnect: disconnectPostgreSQLDatabase
    }
} as const