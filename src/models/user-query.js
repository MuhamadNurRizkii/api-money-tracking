import { pool } from "../config/db.js";

export const getDataTransactionQuery = async (userId) => {
  const sql = `
  SELECT SUM(amount) AS total_pemasukan FROM transactions WHERE type = 'pemasukkan' AND id_user = ?;
  SELECT SUM(amount) AS total_pengeluaran FROM transactions WHERE type = 'pengeluaran' AND id_user = ?;
  SELECT id, id_user, title, amount, type, DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
  FROM transactions
  WHERE id_user = ?
  ORDER BY transactions.created_at DESC
  LIMIT 5;
`;
  const [results] = await pool.query(sql, [userId, userId, userId]);

  return {
    total_pemasukan: results[0][0]?.total_pemasukan || 0,
    total_pengeluaran: results[1][0]?.total_pengeluaran || 0,
    recent: results[2],
  };
};

export const getDetailTransactionQuery = async (
  userId,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  // hitung total data user saat ini
  const countSql =
    "SELECT COUNT(*) as total FROM transactions WHERE id_user = ?";
  const [countResult] = await pool.query(countSql, [userId]);
  const totalData = countResult[0].total;
  const totalPages = Math.ceil(totalData / limit);

  // ambil data sesuai limit & offset
  const sql = `SELECT 
    id,
    id_user,
    title,
    amount,
    type,
    DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
  FROM transactions WHERE id_user = ? LIMIT ? OFFSET ?`;
  const [result] = await pool.query(sql, [userId, limit, offset]);

  return {
    currentPage: page,
    totalPages,
    totalData,
    data: result,
  };
};

export const createTransactionQuery = async (userId, title, amount, type) => {
  const sql = `INSERT INTO transactions (id_user, title, amount, type) VALUES (?,?,?,?);`;

  const result = await pool.query(sql, [userId, title, amount, type]);

  return result[0];
};

export const getTransactionsByIdQuery = async (id, userId) => {
  const sql = `SELECT 
    id,
    id_user,
    title,
    amount,
    type,
    DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at FROM transactions WHERE id = ? AND id_user = ?`;

  const [result] = await pool.query(sql, [id, userId]);

  return result[0];
};

export const updateTransactionsByIdQuery = async (id, userId, data) => {
  // Build bagian SET secara dinamis
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  // Jika tidak ada field untuk diupdate
  if (fields.length === 0) return null;

  const sql = `UPDATE transactions SET ${fields.join(
    ", "
  )} WHERE id = ? AND id_user = ?`;

  values.push(id, userId);

  const [result] = await pool.query(sql, values);

  // result biasanya berisi info affectedRows, dll
  return result.affectedRows > 0;
};

export const deleteTransactionByIdQuery = async (id, userId) => {
  const sql = `DELETE FROM transactions WHERE id = ? AND id_user = ?`;

  const result = await pool.query(sql, [id, userId]);

  return result;
};

export const getDataProfileQuery = async (userId) => {
  const sql = `select u.first_name, u.last_name, u.username, sum(case when t.type = 'pemasukkan' then amount else 0 end) as total_pemasukkan, sum(case when t.type = 'pengeluaran' then amount else 0 end) as total_pengeluaran from transactions as t join users as u on (t.id_user = u.id) where t.id_user = ?`;

  const [result] = await pool.query(sql, [userId]);

  return result[0];
};

export const getTransactionsByWeekQuery = async (userId) => {
  const sql = `SELECT 
    DATE_FORMAT(created_at, '%Y-%m-%d') AS tanggal,
    SUM(CASE WHEN type = 'pemasukkan' THEN amount ELSE 0 END) AS total_pemasukkan,
    SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) AS total_pengeluaran
FROM transactions
WHERE created_at >= NOW() - INTERVAL 7 DAY
  AND id_user = ?
GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d') ASC;
`;

  const [rows] = await pool.query(sql, [userId]);

  return rows.map((r) => ({
    date: r.tanggal,
    pemasukkan: Number(r.total_pemasukkan),
    pengeluaran: Number(r.total_pengeluaran),
  }));
};

export const getTransactionsByMonthQuery = async (userId) => {
  const sql = `SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS bulan,
    SUM(CASE WHEN type = 'pemasukkan' THEN amount ELSE 0 END) AS total_pemasukkan,
    SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) AS total_pengeluaran
FROM transactions
WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-01-01') 
  AND created_at < DATE_FORMAT(CURDATE() + INTERVAL 1 YEAR, '%Y-01-01')
  AND id_user = ?
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY DATE_FORMAT(created_at, '%Y-%m');
;
`;

  const [rows] = await pool.query(sql, [userId]);

  return rows.map((r) => ({
    month: r.bulan,
    pemasukkan: Number(r.total_pemasukkan),
    pengeluaran: Number(r.total_pengeluaran),
  }));
};
