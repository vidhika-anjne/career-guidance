import express from "express";
import { getPool } from "../db/pool.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/colleges
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const { name, state, city, types, ownership, path, min_rank, max_rank, min_score, max_score, limit = 50, offset = 0 } = req.query;
    const where = [];
    const params = [];
    if (name) { where.push("name LIKE ?"); params.push(`%${name}%`); }
    if (state) { where.push("state = ?"); params.push(String(state).toLowerCase()); }
    if (city) { where.push("city = ?"); params.push(String(city).toLowerCase()); }
    if (ownership) { where.push("ownership = ?"); params.push(String(ownership).toLowerCase()); }
    if (types) {
      const list = String(types).split(",").map(s => s.trim()).filter(Boolean);
      if (list.length === 1) { where.push("type = ?"); params.push(list[0].toLowerCase()); }
      else if (list.length > 1) { where.push(`type IN (${list.map(() => "?").join(",")})`); params.push(...list.map(s => s.toLowerCase())); }
    }
    if (path) { where.push("JSON_CONTAINS(paths, JSON_QUOTE(?))"); params.push(String(path).toLowerCase()); }
    // Ranking filters
    if (min_rank) { where.push("rank_position >= ?"); params.push(Number(min_rank)); }
    if (max_rank) { where.push("rank_position <= ?"); params.push(Number(max_rank)); }
    if (min_score) { where.push("total_score >= ?"); params.push(Number(min_score)); }
    if (max_score) { where.push("total_score <= ?"); params.push(Number(max_score)); }
    const sql = `SELECT id, name, state, city, type, ownership, description, website, latitude, longitude,
                        ranking, fees_min, fees_max, exams, courses, accreditation, email, phone,
                        institute_id, tlr, rpc, go_score, oi, perception, total_score, rank_position
                 FROM colleges ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY CASE WHEN total_score IS NOT NULL THEN 0 ELSE 1 END, total_score DESC, name LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return res.json({ items: rows });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/colleges/cities - Get unique cities with college counts
router.get("/cities", async (req, res) => {
  try {
    const pool = getPool();
    const sql = `SELECT city, state, COUNT(*) as count
                 FROM colleges
                 WHERE city IS NOT NULL AND city != ''
                 GROUP BY city, state
                 ORDER BY city ASC`;
    const [rows] = await pool.query(sql);
    return res.json({ items: rows });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/colleges/near
router.get("/near", async (req, res) => {
  try {
    const pool = getPool();
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radius_km || 25);
    const { type, ownership, path, limit = 50, offset = 0 } = req.query;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }
    const filters = ['latitude IS NOT NULL AND longitude IS NOT NULL'];
    const params = [];
    if (type) { filters.push('type = ?'); params.push(String(type).toLowerCase()); }
    if (ownership) { filters.push('ownership = ?'); params.push(String(ownership).toLowerCase()); }
    if (path) { filters.push('JSON_CONTAINS(paths, JSON_QUOTE(?))'); params.push(String(path).toLowerCase()); }
    const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
    const sql = `SELECT id, name, state, city, type, ownership, description, website, latitude, longitude,
                        ranking, fees_min, fees_max, exams, courses, accreditation, email, phone,
                        (6371 * ACOS( COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?))
                          + SIN(RADIANS(?)) * SIN(RADIANS(latitude)) )) AS distance
                 FROM colleges
                 ${where}
                 HAVING distance <= ?
                 ORDER BY distance ASC
                 LIMIT ? OFFSET ?`;
    const allParams = [lat, lng, lat, ...params, radiusKm, Number(limit), Number(offset)];
    const [rows] = await pool.query(sql, allParams);
    return res.json({ items: rows });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin-like endpoints (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const { name, state, city, type, ownership = 'government', paths = [], description = null, website = null, latitude = null, longitude = null } = req.body || {};
    if (!name || !state || !city || !type) return res.status(400).json({ message: 'name, state, city, type are required' });

    const pathsArr = Array.isArray(paths) ? paths.map(p => String(p).toLowerCase()) : [];
    const pathsExpr = pathsArr.length ? `JSON_ARRAY(${pathsArr.map(() => '?').join(',')})` : 'JSON_ARRAY()';
    const params = [
      name,
      String(state).toLowerCase(),
      String(city).toLowerCase(),
      String(type).toLowerCase(),
      String(ownership).toLowerCase(),
      ...pathsArr,
      description,
      website,
      latitude,
      longitude,
    ];
    const sql = `INSERT INTO colleges (name, state, city, type, ownership, paths, description, website, latitude, longitude)
                 VALUES (?, ?, ?, ?, ?, ${pathsExpr}, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, params);
    const id = result.insertId;
    const [rows] = await pool.query('SELECT * FROM colleges WHERE id=?', [id]);
    return res.status(201).json({ item: rows[0] });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);
    const { name, state, city, type, ownership, paths, description, website, latitude, longitude } = req.body || {};
    const fields = [];
    const params = [];
    if (name != null) { fields.push('name=?'); params.push(name); }
    if (state != null) { fields.push('state=?'); params.push(String(state).toLowerCase()); }
    if (city != null) { fields.push('city=?'); params.push(String(city).toLowerCase()); }
    if (type != null) { fields.push('type=?'); params.push(String(type).toLowerCase()); }
    if (ownership != null) { fields.push('ownership=?'); params.push(String(ownership).toLowerCase()); }
    if (paths != null) {
      const pathsArr = Array.isArray(paths) ? paths.map(p => String(p).toLowerCase()) : [];
      const pathsExpr = pathsArr.length ? `JSON_ARRAY(${pathsArr.map(() => '?').join(',')})` : 'JSON_ARRAY()';
      fields.push(`paths=${pathsExpr}`);
      params.push(...pathsArr);
    }
    if (description !== undefined) { fields.push('description=?'); params.push(description); }
    if (website !== undefined) { fields.push('website=?'); params.push(website); }
    if (latitude !== undefined) { fields.push('latitude=?'); params.push(latitude); }
    if (longitude !== undefined) { fields.push('longitude=?'); params.push(longitude); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    const sql = `UPDATE colleges SET ${fields.join(', ')} WHERE id=?`;
    params.push(id);
    await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM colleges WHERE id=?', [id]);
    return res.json({ item: rows[0] });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);
    await pool.query('DELETE FROM colleges WHERE id=?', [id]);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
