import mysql from "mysql2/promise";

export const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'pokemon_catalogue'
});