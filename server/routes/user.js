import express from "express";
import { getPool } from "../db/pool.js";
import { authMiddleware } from "../middleware/auth.js";
import { getUserById } from "../models/user.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT user_id, age, gender, class_level, location, interests, academic_performance, phone, address FROM user_profiles WHERE user_id=?",
      [req.user.id]
    );
    const profile = rows[0] || null;
    if (profile) {
      try { if (profile.interests) profile.interests = JSON.parse(profile.interests); } catch (_) {}
      try { if (profile.academic_performance) profile.academic_performance = JSON.parse(profile.academic_performance); } catch (_) {}
    }
    return res.json({ profile });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const {
      age = null,
      gender = null,
      class_level = null,
      location = null,
      interests = null,
      academic_performance = null,
      phone = null,
      address = null,
    } = req.body || {};
    const interestsJson = interests != null ? JSON.stringify(interests) : null;
    const perfJson = academic_performance != null ? JSON.stringify(academic_performance) : null;
    await pool.query(
      `INSERT INTO user_profiles (user_id, age, gender, class_level, location, interests, academic_performance, phone, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         age=VALUES(age), gender=VALUES(gender), class_level=VALUES(class_level), location=VALUES(location),
         interests=VALUES(interests), academic_performance=VALUES(academic_performance), phone=VALUES(phone), address=VALUES(address)`,
      [req.user.id, age, gender, class_level, location, interestsJson, perfJson, phone, address]
    );
    const [rows] = await pool.query(
      "SELECT user_id, age, gender, class_level, location, interests, academic_performance, phone, address FROM user_profiles WHERE user_id=?",
      [req.user.id]
    );
    const profile = rows[0] || null;
    if (profile) {
      try { if (profile.interests) profile.interests = JSON.parse(profile.interests); } catch (_) {}
      try { if (profile.academic_performance) profile.academic_performance = JSON.parse(profile.academic_performance); } catch (_) {}
    }
    return res.json({ profile });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/name", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const { name } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    await pool.query("UPDATE users SET name=? WHERE id=?", [String(name).trim(), req.user.id]);
    const user = await getUserById(req.user.id);
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
