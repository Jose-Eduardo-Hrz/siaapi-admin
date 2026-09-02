import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '$env/static/private';

type Pool = ReturnType<typeof mysql.createPool>;

declare global {
    var __mysql_pool: Pool | undefined;
}

const pool: Pool = globalThis.__mysql_pool ?? mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { pool };