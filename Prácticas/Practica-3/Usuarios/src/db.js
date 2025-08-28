import mysql from "mysql2/promise";

const {
    DB_HOST = "db",
    DB_PORT = "3306",
    DB_NAME = "usersdb",
    DB_USER = "userapp",
    DB_PASS = "secret123",
} = process.env;

export const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});
