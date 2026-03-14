import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const pool = mysql.createPool({
  port: isProduction ? Number(process.env.PORT) : 3306,
  host: isProduction ? process.env.HOST : "localhost",
  user: isProduction ? process.env.USER : "root",
  password: isProduction ? process.env.PASSWORD : "1234",
  database: isProduction ? process.env.DATABASE : "money_tracking",
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
});
