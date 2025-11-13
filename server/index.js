import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ansh';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/config/public', (req, res) => {
  return res.json({ googleClientId: GOOGLE_CLIENT_ID });
});

let pool;

async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    multipleStatements: true,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
  await connection.query(`USE \`${MYSQL_DATABASE}\``);
  await connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    provider ENUM('local','google') NOT NULL DEFAULT 'local',
    google_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  await connection.query(`CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    age INT NULL,
    gender VARCHAR(32) NULL,
    class_level VARCHAR(32) NULL,
    location VARCHAR(128) NULL,
    interests JSON NULL,
    academic_performance JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  await connection.query(`CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type ENUM('technology','commerce','arts','design','science','medical') NOT NULL,
    description TEXT NULL,
    website VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  // Ensure extended columns exist for advanced filtering and maps (compatible with MySQL versions)
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN ownership ENUM('government','private') NOT NULL DEFAULT 'government'`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN paths JSON NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN latitude DECIMAL(10,7) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN longitude DECIMAL(10,7) NULL`); } catch (_) {}
  // Additional colleges attributes
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN ranking INT NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN fees_min INT NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN fees_max INT NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN exams JSON NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN courses JSON NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN accreditation VARCHAR(100) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN email VARCHAR(255) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN phone VARCHAR(20) NULL`); } catch (_) {}
  // Users extra fields
  try { await connection.query(`ALTER TABLE users ADD COLUMN role ENUM('user','admin') NOT NULL DEFAULT 'user'`); } catch (_) {}
  try { await connection.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1`); } catch (_) {}
  // User profiles extra fields
  try { await connection.query(`ALTER TABLE user_profiles ADD COLUMN phone VARCHAR(20) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE user_profiles ADD COLUMN address TEXT NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE user_profiles ADD COLUMN preferences JSON NULL`); } catch (_) {}
  await connection.end();
  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Seed sample colleges if table is empty
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM colleges');
  if (rows[0].cnt === 0) {
    await pool.query(
      `INSERT INTO colleges (name, state, city, type, description, website, ownership, paths, latitude, longitude) VALUES 
      ('Indian Institute of Technology Delhi', 'delhi', 'new delhi', 'technology', 'Top engineering institute', 'https://home.iitd.ac.in', 'government', JSON_ARRAY('technology','science'), 28.5458, 77.1927),
      ('All India Institute of Medical Sciences (AIIMS) Delhi', 'delhi', 'new delhi', 'science', 'Premier medical and research institute', 'https://www.aiims.edu', 'government', JSON_ARRAY('science','medical'), 28.5672, 77.2100),
      ('University of Delhi', 'delhi', 'delhi', 'arts', 'Central university with diverse programs', 'http://www.du.ac.in', 'government', JSON_ARRAY('arts','commerce','science'), 28.6139, 77.2090),
      ('National Institute of Design Ahmedabad', 'gujarat', 'ahmedabad', 'design', 'Premier design school', 'https://www.nid.edu', 'government', JSON_ARRAY('design'), 23.0300, 72.5800),
      ('Indian Institute of Technology Bombay', 'maharashtra', 'mumbai', 'technology', 'Leading engineering and research institute', 'https://www.iitb.ac.in', 'government', JSON_ARRAY('technology','science'), 19.1334, 72.9133),
      ('National Institute of Technology Tiruchirappalli', 'tamil nadu', 'tiruchirappalli', 'technology', 'National engineering institute', 'https://www.nitt.edu', 'government', JSON_ARRAY('technology','science'), 10.7598, 78.8136),
      ('Indian Institute of Management Ahmedabad', 'gujarat', 'ahmedabad', 'commerce', 'Top management institute', 'https://www.iima.ac.in', 'government', JSON_ARRAY('commerce'), 23.0300, 72.5400)`
    );
  }
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function getUserById(id) {
  const [rows] = await pool.query('SELECT id, name, email, provider, google_id, created_at, updated_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
}

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    let token = null;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    else if (header.startsWith('Bearer ')) token = header.substring(7);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isGmail = (email) => /@gmail\.com$/i.test(email);

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!isGmail(email)) return res.status(400).json({ message: 'Only @gmail.com emails are allowed' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await getUserByEmail(email);
    if (existing) {
      if (existing.provider === 'google' && !existing.password_hash) {
        return res.status(400).json({ message: 'Email already registered with Google. Use Google sign-in.' });
      }
      return res.status(400).json({ message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, provider) VALUES (?, ?, ?, \"local\")',
      [name, email, password_hash]
    );
    const id = result.insertId;
    const token = createToken({ id });
    setAuthCookie(res, token);
    const user = await getUserById(id);
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    if (!isGmail(email)) return res.status(400).json({ message: 'Only @gmail.com emails are allowed' });
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.provider !== 'local') return res.status(400).json({ message: 'Use Google sign-in for this account' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = createToken({ id: user.id });
    setAuthCookie(res, token);
    const safeUser = await getUserById(user.id);
    return res.json({ user: safeUser });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ message: 'Google client not configured' });
    if (!credential) return res.status(400).json({ message: 'Missing credential' });
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const sub = payload.sub;
    const email = payload.email;
    const name = payload.name || email;
    if (!email) return res.status(400).json({ message: 'Google account missing email' });

    let user = await getUserByEmail(email);
    if (!user) {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, provider, google_id) VALUES (?, ?, \"google\", ?)',
        [name, email, sub]
      );
      user = await getUserById(result.insertId);
    } else {
      if (!user.google_id) {
        await pool.query('UPDATE users SET provider=\'google\', google_id=? WHERE id=?', [sub, user.id]);
      }
      user = await getUserById(user.id);
    }

    const token = createToken({ id: user.id });
    setAuthCookie(res, token);
    return res.json({ user });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid Google credential' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true });
});

// User profile and account endpoints
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, age, gender, class_level, location, interests, academic_performance, phone, address FROM user_profiles WHERE user_id=?',
      [req.user.id]
    );
    const profile = rows[0] || null;
    if (profile) {
      try { if (profile.interests) profile.interests = JSON.parse(profile.interests); } catch (_) {}
      try { if (profile.academic_performance) profile.academic_performance = JSON.parse(profile.academic_performance); } catch (_) {}
    }
    return res.json({ profile });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
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
      'SELECT user_id, age, gender, class_level, location, interests, academic_performance, phone, address FROM user_profiles WHERE user_id=?',
      [req.user.id]
    );
    const profile = rows[0] || null;
    if (profile) {
      try { if (profile.interests) profile.interests = JSON.parse(profile.interests); } catch (_) {}
      try { if (profile.academic_performance) profile.academic_performance = JSON.parse(profile.academic_performance); } catch (_) {}
    }
    return res.json({ profile });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/user/name', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    await pool.query('UPDATE users SET name=? WHERE id=?', [String(name).trim(), req.user.id]);
    const user = await getUserById(req.user.id);
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const [rows] = await pool.query('SELECT id, password_hash, provider FROM users WHERE id=?', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.provider !== 'local') return res.status(400).json({ message: 'Password managed via Google sign-in' });
    const ok = await bcrypt.compare(currentPassword || '', user.password_hash || '');
    if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash=? WHERE id=?', [password_hash, req.user.id]);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Health check (verifies DB connection too)
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    return res.status(500).json({ ok: false, db: false });
  }
});

// Debug DB info (do not expose in production)
app.get('/api/debug/dbinfo', async (req, res) => {
  try {
    const [[dbRow]] = await pool.query('SELECT DATABASE() AS db');
    const [[uc]] = await pool.query('SELECT COUNT(*) AS c FROM users');
    let up = 0, co = 0;
    try { const [[upc]] = await pool.query('SELECT COUNT(*) AS c FROM user_profiles'); up = upc.c; } catch (_) {}
    try { const [[cc]] = await pool.query('SELECT COUNT(*) AS c FROM colleges'); co = cc.c; } catch (_) {}
    return res.json({ database: dbRow.db, counts: { users: uc.c, user_profiles: up, colleges: co } });
  } catch (e) {
    return res.status(500).json({ message: 'debug failed' });
  }
});

// Colleges API
app.get('/api/colleges', async (req, res) => {
  try {
    const { name, state, city, types, ownership, path, limit = 50, offset = 0 } = req.query;
    const where = [];
    const params = [];
    if (name) { where.push('name LIKE ?'); params.push(`%${name}%`); }
    if (state) { where.push('state = ?'); params.push(state.toLowerCase()); }
    if (city) { where.push('city = ?'); params.push(city.toLowerCase()); }
    if (ownership) { where.push('ownership = ?'); params.push(ownership.toLowerCase()); }
    if (types) {
      const list = String(types).split(',').map(s => s.trim()).filter(Boolean);
      if (list.length === 1) { where.push('type = ?'); params.push(list[0].toLowerCase()); }
      else if (list.length > 1) { where.push(`type IN (${list.map(() => '?').join(',')})`); params.push(...list.map(s => s.toLowerCase())); }
    }
    if (path) { where.push('JSON_CONTAINS(paths, JSON_QUOTE(?))'); params.push(path.toLowerCase()); }
    const sql = `SELECT id, name, state, city, type, ownership, description, website, latitude, longitude,
                        ranking, fees_min, fees_max, exams, courses, accreditation, email, phone
                 FROM colleges ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY name LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return res.json({ items: rows });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Nearby colleges using Haversine distance
app.get('/api/colleges/near', async (req, res) => {
  try {
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
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create college
app.post('/api/colleges', authMiddleware, async (req, res) => {
  try {
    const { name, state, city, type, ownership = 'government', paths = [], description = null, website = null, latitude = null, longitude = null } = req.body || {};
    if (!name || !state || !city || !type) return res.status(400).json({ message: 'name, state, city, type are required' });
    const [result] = await pool.query(
      'INSERT INTO colleges (name, state, city, type, ownership, paths, description, website, latitude, longitude) VALUES (?, ?, ?, ?, ?, JSON_ARRAY(?), ?, ?, ?, ?)',
      [name, String(state).toLowerCase(), String(city).toLowerCase(), String(type).toLowerCase(), String(ownership).toLowerCase(), ...(Array.isArray(paths) ? paths.map(p => String(p).toLowerCase()) : []), description, website, latitude, longitude]
    );
    const id = result.insertId;
    const [rows] = await pool.query('SELECT * FROM colleges WHERE id=?', [id]);
    return res.status(201).json({ item: rows[0] });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update college
app.put('/api/colleges/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, state, city, type, ownership, paths, description, website, latitude, longitude } = req.body || {};
    const fields = [];
    const params = [];
    if (name != null) { fields.push('name=?'); params.push(name); }
    if (state != null) { fields.push('state=?'); params.push(String(state).toLowerCase()); }
    if (city != null) { fields.push('city=?'); params.push(String(city).toLowerCase()); }
    if (type != null) { fields.push('type=?'); params.push(String(type).toLowerCase()); }
    if (ownership != null) { fields.push('ownership=?'); params.push(String(ownership).toLowerCase()); }
    if (paths != null) { fields.push('paths=JSON_ARRAY(?)'); params.push(...(Array.isArray(paths) ? paths.map(p => String(p).toLowerCase()) : [])); }
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

// Admin: delete college
app.delete('/api/colleges/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM colleges WHERE id=?', [id]);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database', err);
    process.exit(1);
  });
