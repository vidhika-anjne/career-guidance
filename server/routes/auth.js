import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { getPool } from "../db/pool.js";
import { authMiddleware, setAuthCookie, clearAuthCookie } from "../middleware/auth.js";
import { createToken } from "../utils/jwt.js";
import { getUserByEmail, getUserById } from "../models/user.js";
import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/env.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isGmail = (email) => /@gmail\.(com|in)$/i.test(email);



router.post("/register", async (req, res) => {
  try {
    return res.status(400).json({
      message: "Signup now requires OTP verification. Use /api/auth/signup/request-otp then /api/auth/signup/verify.",
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Signup with OTP: request code
router.post("/signup/request-otp", async (req, res) => {
  try {
    const pool = getPool();
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });
    if (!isGmail(email)) return res.status(400).json({ message: "Only @gmail.com or @gmail.in emails are allowed" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const nameStr = String(name || "").trim();
    if (!/^[A-Za-z ]+$/.test(nameStr) || nameStr.replace(/\s/g, "").length < 2) {
      return res.status(400).json({ message: "Name should contain letters and spaces only" });
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      if (existing.provider === "google" && !existing.password_hash) {
        return res.status(400).json({ message: "Email already registered with Google. Use Google sign-in." });
      }
      return res.status(400).json({ message: "Email already in use" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otp_hash = await bcrypt.hash(otp, 10);
    const data = JSON.stringify({ name: nameStr, password_hash: await bcrypt.hash(String(password), 10) });
    await pool.query(
      `INSERT INTO email_otps (email, purpose, otp_hash, data, expires_at, used)
       VALUES (?, 'signup', ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0)
       ON DUPLICATE KEY UPDATE otp_hash=VALUES(otp_hash), data=VALUES(data), expires_at=VALUES(expires_at), used=0`,
      [email, otp_hash, data]
    );
    const subject = "Your CareerVerse signup code";
    const text = `Your OTP is ${otp}. It expires in 15 minutes.`;
    const html = `<p>Your signup verification code is <strong>${otp}</strong>.</p><p>This code expires in 15 minutes.</p>`;
    await sendMail(email, subject, text, html);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Signup with OTP: verify and create account
router.post("/signup/verify", async (req, res) => {
  try {
    console.log('🔍 Signup verify request:', { email: req.body?.email, otp: req.body?.otp?.slice(0, 2) + '***' });
    const pool = getPool();
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      console.log('❌ Missing email or OTP');
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({ message: "Invalid email format" });
    }
    console.log('✅ Querying OTP record...');
    const [rows] = await pool.query(
      "SELECT otp_hash, data, expires_at FROM email_otps WHERE email=? AND purpose='signup' AND used=0 AND expires_at > NOW()",
      [email]
    );
    const rec = rows[0];
    if (!rec) {
      console.log('❌ No valid OTP record found for:', email);
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }
    console.log('✅ OTP record found, comparing...');
    const ok = await bcrypt.compare(String(otp), rec.otp_hash || "");
    if (!ok) {
      console.log('❌ OTP comparison failed');
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }
    console.log('✅ OTP verified, parsing payload...');
    let payload = {};
    try {
      const raw = rec.data;
      if (typeof raw === "string") {
        payload = JSON.parse(raw);
      } else if (raw && typeof raw === "object") {
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(raw)) {
          payload = JSON.parse(raw.toString("utf8"));
        } else {
          payload = raw;
        }
      }
    } catch (parseErr) {
      console.error('❌ Payload parse error:', parseErr);
      payload = {};
    }
    console.log('✅ Payload parsed:', Object.keys(payload));
    const nameStr = String(payload.name || "").trim();
    const password_hash = payload.password_hash;
    if (!nameStr || !password_hash) {
      console.log('❌ Missing name or password_hash in payload');
      return res.status(400).json({ message: "Invalid signup data" });
    }
    console.log('✅ Checking if email exists...');
    const existing = await getUserByEmail(email);
    if (existing) {
      console.log('❌ Email already in use');
      return res.status(400).json({ message: "Email already in use" });
    }
    console.log('✅ Creating user...');

    // ADAPTIVE TEST FIELDS (OPTIONAL) - Maintain backward compatibility
    const education_level = payload.education_level || null;
    const class_or_year = payload.class_or_year || null;
    const stream_status = payload.stream_status || null;
    const selected_stream = payload.selected_stream || null;

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, provider, education_level, class_or_year, stream_status, selected_stream) 
       VALUES (?, ?, ?, "local", ?, ?, ?, ?)`,
      [nameStr, email, password_hash, education_level, class_or_year, stream_status, selected_stream]
    );
    await pool.query("UPDATE email_otps SET used=1 WHERE email=? AND purpose='signup'", [email]);
    const id = result.insertId;
    console.log('✅ User created with ID:', id);
    const user = await getUserById(id);
    const token = createToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);
    console.log('✅ Signup complete for:', email);
    return res.json({ user });
  } catch (e) {
    console.error('❌ Signup verify error:', e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

// Forgot password: request OTP
router.post("/forgot/request", async (req, res) => {
  try {
    const pool = getPool();
    const { email } = req.body || {};
    if (!email || !emailRegex.test(email)) return res.status(400).json({ message: "Valid email required" });
    if (!isGmail(email)) return res.status(400).json({ message: "Only @gmail.com or @gmail.in emails are allowed" });
    const user = await getUserByEmail(email);
    if (!user) return res.status(200).json({ success: true });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otp_hash = await bcrypt.hash(otp, 10);
    await pool.query(
      `INSERT INTO password_resets (user_id, otp_hash, expires_at, used)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0)
       ON DUPLICATE KEY UPDATE otp_hash=VALUES(otp_hash), expires_at=VALUES(expires_at), used=0`,
      [user.id, otp_hash]
    );
    const subject = "Your CareerVerse password reset code";
    const text = `Your OTP is ${otp}. It expires in 15 minutes.`;
    const html = `<p>Your password reset code is <strong>${otp}</strong>.</p><p>This code expires in 15 minutes.</p>`;
    await sendMail(email, subject, text, html);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Forgot password: verify OTP and issue short-lived reset token
router.post("/forgot/verify", async (req, res) => {
  try {
    const pool = getPool();
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid OTP or expired" });
    const [rows] = await pool.query(
      "SELECT otp_hash FROM password_resets WHERE user_id=? AND used=0 AND expires_at > NOW()",
      [user.id]
    );
    const rec = rows[0];
    if (!rec) return res.status(400).json({ message: "Invalid OTP or expired" });
    const ok = await bcrypt.compare(String(otp), rec.otp_hash || "");
    if (!ok) return res.status(400).json({ message: "Invalid OTP or expired" });
    const resetToken = jwt.sign({ id: user.id, purpose: "password_reset" }, JWT_SECRET, { expiresIn: "15m" });
    return res.json({ success: true, resetToken });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Forgot password: reset with token
router.post("/forgot/reset", async (req, res) => {
  try {
    const pool = getPool();
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword are required" });
    if (String(newPassword).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (_) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (payload.purpose !== "password_reset") return res.status(400).json({ message: "Invalid token" });
    const user = await getUserById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const password_hash = await bcrypt.hash(String(newPassword), 10);
    await pool.query("UPDATE users SET password_hash=? WHERE id=?", [password_hash, user.id]);
    await pool.query("UPDATE password_resets SET used=1 WHERE user_id=?", [user.id]);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Login with OTP: request code
router.post("/login/request-otp", async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (!isGmail(email)) return res.status(400).json({ message: "Only @gmail.com or @gmail.in emails are allowed" });
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Account not found. Please sign up first.", needsSignup: true, email });
    if (!user.password_hash) return res.status(400).json({ message: "No password set. Use Google sign-in or set a password via Forgot Password." });
    const ok = await bcrypt.compare(String(password), user.password_hash || "");
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otp_hash = await bcrypt.hash(otp, 10);
    console.log('[LOGIN] Generated OTP for:', email, '- Code:', otp);
    await pool.query(
      `INSERT INTO email_otps (email, purpose, otp_hash, data, expires_at, used)
       VALUES (?, 'login', ?, NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 0)
       ON DUPLICATE KEY UPDATE otp_hash=VALUES(otp_hash), expires_at=VALUES(expires_at), used=0`,
      [email, otp_hash]
    );
    const subject = "Your CareerVerse login code";
    const text = `Your OTP is ${otp}. It expires in 30 minutes.`;
    const html = `<p>Your login verification code is <strong>${otp}</strong>.</p><p>This code expires in 30 minutes.</p>`;
    await sendMail(email, subject, text, html);
    console.log('[LOGIN] OTP email sent to:', email);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Login with OTP: verify and issue session
router.post("/login/verify", async (req, res) => {
  try {
    const pool = getPool();
    const { email, otp } = req.body || {};
    console.log('[LOGIN] Verify attempt for:', email);

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    // Removed debug query that was causing SQL errors
    // const [allRecords] = await pool.query(...);
    // console.log('[LOGIN] OTP records found:', allRecords.length);


    const [rows] = await pool.query(
      "SELECT otp_hash FROM email_otps WHERE email=? AND purpose='login' AND used=0 AND expires_at > NOW()",
      [email]
    );
    const rec = rows[0];

    if (!rec) {
      console.log('[LOGIN] No valid OTP record');
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    console.log('[LOGIN] Comparing OTP hash...');
    const ok = await bcrypt.compare(String(otp), rec.otp_hash || "");
    console.log('[LOGIN] Hash comparison:', ok);

    if (!ok) return res.status(400).json({ message: "Invalid OTP or expired" });

    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Account not found. Please sign up first.", needsSignup: true, email });

    await pool.query("UPDATE email_otps SET used=1 WHERE email=? AND purpose='login'", [email]);
    const safeUser = await getUserById(user.id);
    const token = createToken({ id: safeUser.id, role: safeUser.role });
    setAuthCookie(res, token);
    console.log('[LOGIN] Success for:', email);
    return res.json({ user: safeUser });
  } catch (e) {
    console.error('[LOGIN] Error:', e.message, e.stack);
    return res.status(500).json({ message: "Server error" });
  }
});

// DIRECT PASSWORD LOGIN (bypasses OTP)
router.post("/login", async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body || {};

    console.log('[DIRECT LOGIN] Attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "Account not found. Please sign up first.",
        needsSignup: true,
        email
      });
    }

    if (!user.password_hash) {
      return res.status(400).json({
        message: "No password set. Use Google sign-in or set a password."
      });
    }

    const ok = await bcrypt.compare(String(password), user.password_hash || "");
    console.log('[DIRECT LOGIN] Password match:', ok);

    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Login successful - get full user data and create session
    const safeUser = await getUserById(user.id);
    const token = createToken({ id: safeUser.id, role: safeUser.role });
    setAuthCookie(res, token);

    console.log('[DIRECT LOGIN] Success for:', email);
    return res.json({ user: safeUser });
  } catch (e) {
    console.error('[DIRECT LOGIN] Error:', e.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/signup/request-otp", (req, res) => {
  return res.status(405).json({ message: "Use POST /api/auth/signup/request-otp with name, email, password" });
});
router.get("/signup/verify", (req, res) => {
  return res.status(405).json({ message: "Use POST /api/auth/signup/verify with email and otp" });
});
router.get("/login/request-otp", (req, res) => {
  return res.status(405).json({ message: "Use POST /api/auth/login/request-otp with email and password" });
});
router.get("/login/verify", (req, res) => {
  return res.status(405).json({ message: "Use POST /api/auth/login/verify with email and otp" });
});

router.post("/google", async (req, res) => {
  try {
    const { credential, mode } = req.body || {};
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
      if (String(mode) === "login") {
        return res.status(400).json({ message: "Account not found. Please sign up first.", needsSignup: true, email });
      }
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

    const token = createToken({ id: user.id, role: user.role });
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
    if (!user.password_hash) return res.status(400).json({ message: "No password set for this account" });
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
