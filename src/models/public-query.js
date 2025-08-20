import { pool } from "../config/db.js";

export const findUserByUsername = async (username) => {
  const sql = "SELECT id, username, password from users where username = ?";

  const result = await pool.query(sql, [username]);

  return result[0];
};

export const registerQuery = async ({
  first_name,
  last_name,
  username,
  hashedPassword,
}) => {
  const sql =
    "INSERT INTO users (first_name,last_name,username,password) VALUES (?,?,?,?)";

  const result = await pool.query(sql, [
    first_name,
    last_name,
    username,
    hashedPassword,
  ]);

  return result;
};
