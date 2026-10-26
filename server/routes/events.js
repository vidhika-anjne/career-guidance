import express from "express";
import { getPool } from "../db/pool.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

function normalizeTitle(title) {
  return String(title || "").trim();
}
function isTitleValid(title) {
  const t = normalizeTitle(title);
  if (!t) return false;
  return /[A-Za-z]/.test(t); // must contain at least one alphabetic character
}
function toDateOnly(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// GET /api/events?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user.id;
    const { from, to, limit = 200, offset = 0 } = req.query || {};
    const where = ["user_id=?"]; const params = [userId];
    if (from) { where.push("event_date >= ?"); params.push(String(from)); }
    if (to) { where.push("event_date <= ?"); params.push(String(to)); }
    const sql = `SELECT id, title, event_date AS date, type, description, priority
                 FROM events WHERE ${where.join(" AND ")}
                 ORDER BY event_date DESC, id DESC
                 LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    // tag as personal category for frontend
    const items = rows.map(r => ({ ...r, category: r.type === 'personal' ? 'personal' : r.type }));
    return res.json({ items });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/events
router.post("/", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user.id;
    const { title, date, type = 'personal', description = null, priority = 'medium' } = req.body || {};

    if (!isTitleValid(title)) {
      return res.status(400).json({ message: "Title must contain letters and cannot be only numbers" });
    }
    const dateOnly = toDateOnly(date);
    if (!dateOnly) {
      return res.status(400).json({ message: "Invalid date" });
    }
    const allowedTypes = new Set(['personal','exam','scholarship','registration','deadline']);
    const useType = allowedTypes.has(String(type)) ? String(type) : 'personal';
    const allowedPriority = new Set(['low','medium','high']);
    const usePriority = allowedPriority.has(String(priority)) ? String(priority) : 'medium';

    const [result] = await pool.query(
      `INSERT INTO events (user_id, title, event_date, type, description, priority)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, normalizeTitle(title), dateOnly, useType, description, usePriority]
    );

    const [rows] = await pool.query(
      `SELECT id, title, event_date AS date, type, description, priority FROM events WHERE id=?`,
      [result.insertId]
    );
    const item = { ...rows[0], category: rows[0].type === 'personal' ? 'personal' : rows[0].type };
    return res.status(201).json({ item });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const pool = getPool();
    const [result] = await pool.query("DELETE FROM events WHERE id=? AND user_id=?", [id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
