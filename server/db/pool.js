import mysql from "mysql2/promise";
import {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from "../config/env.js";

let pool;

export function getPool() {
  if (!pool) throw new Error("Database pool not initialized. Call ensureDatabase() first.");
  return pool;
}

export async function ensureDatabase() {
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
  // Ensure extended columns exist
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN ownership ENUM('government','private') NOT NULL DEFAULT 'government'`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN paths JSON NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN latitude DECIMAL(10,7) NULL`); } catch (_) {}
  try { await connection.query(`ALTER TABLE colleges ADD COLUMN longitude DECIMAL(10,7) NULL`); } catch (_) {}
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

  // Create pool
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
