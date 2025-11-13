import express from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { getPool } from "../db/pool.js";
import { authMiddleware, setAuthCookie, clearAuthCookie } from "../middleware/auth.js";
import { createToken } from "../utils/jwt.js";
import { getUserByEmail, getUserById } from "../models/user.js";
import { GOOGLE_CLIENT_ID } from "../config/env.js";

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isGmail = (email) => /@gmail\.com$/i.test(email);

router.post("/register", async (req, res) => {
  try {
    const pool = getPool();
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
    if (!isGmail(email)) return res.status(400).json({ message: "Only @gmail.com emails are allowed" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await getUserByEmail(email);
    if (existing) {
      if (existing.provider === "google" && !existing.password_hash) {
        return res.status(400).json({ message: "Email already registered with Google. Use Google sign-in." });
      }
      return res.status(400).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, provider) VALUES (?, ?, ?, "local")',
      [name, email, password_hash]
    );
    const id = result.insertId;
    const token = createToken({ id });
    setAuthCookie(res, token);
    const user = await getUserById(id);
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (!isGmail(email)) return res.status(400).json({ message: "Only @gmail.com emails are allowed" });
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.provider !== "local") return res.status(400).json({ message: "Use Google sign-in for this account" });
    const ok = await bcrypt.compare(password, user.password_hash || "");
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = createToken({ id: user.id });
    setAuthCookie(res, token);
    const safeUser = await getUserById(user.id);
    return res.json({ user: safeUser });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ message: "Google client not configured" });
    if (!credential) return res.status(400).json({ message: "Missing credential" });
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const sub = payload.sub;
    const email = payload.email;
    const name = payload.name || email;
    if (!email) return res.status(400).json({ message: "Google account missing email" });

    const pool = getPool();
    let user = await getUserByEmail(email);
    if (!user) {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, provider, google_id) VALUES (?, ?, "google", ?)',
        [name, email, sub]
      );
      user = await getUserById(result.insertId);
    } else {
      if (!user.google_id) {
        await pool.query("UPDATE users SET provider='google', google_id=? WHERE id=?", [sub, user.id]);
      }
      user = await getUserById(user.id);
    }

    const token = createToken({ id: user.id });
    setAuthCookie(res, token);
    return res.json({ user });
  } catch (e) {
    return res.status(401).json({ message: "Invalid Google credential" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const pool = getPool();
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const [rows] = await pool.query("SELECT id, password_hash, provider FROM users WHERE id=?", [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.provider !== "local") return res.status(400).json({ message: "Password managed via Google sign-in" });
    const ok = await bcrypt.compare(currentPassword || "", user.password_hash || "");
    if (!ok) return res.status(400).json({ message: "Current password incorrect" });
    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash=? WHERE id=?", [password_hash, req.user.id]);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
