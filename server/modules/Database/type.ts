export type DatabaseType = {
    postgreSQL: {
        disconnect: () => Promise<void>
    }
}