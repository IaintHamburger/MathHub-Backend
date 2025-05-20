export type ConfigurationType = {
    user: string,
    host: string,
    database: string,
    password: string,
    port: number,
    max: number,
    idleTimeoutMillis: number,
    connectionTimeoutMillis: number
}