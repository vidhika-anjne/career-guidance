import { getPool } from "../db/pool.js";

export async function getUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function getUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, name, email, provider, google_id, role, 
            education_level, class_or_year, stream_status, selected_stream,
            created_at, updated_at 
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}
