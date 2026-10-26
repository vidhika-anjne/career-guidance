import dotenv from 'dotenv';
dotenv.config();

import mysql from "mysql2/promise";

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ansh';

let pool = null;

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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NULL,
      provider ENUM('local','google') NOT NULL DEFAULT 'local',
      google_id VARCHAR(255) NULL,
      role ENUM('student','admin') NOT NULL DEFAULT 'student',
      education_level VARCHAR(50) DEFAULT NULL,
      class_or_year VARCHAR(20) DEFAULT NULL,
      stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL,
      selected_stream VARCHAR(50) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Additional tables for OTP, password resets, profiles, events, colleges
  await connection.query(`
    CREATE TABLE IF NOT EXISTS email_otps (
      email VARCHAR(255) PRIMARY KEY,
      purpose ENUM('signup','login') NOT NULL,
      otp_hash VARCHAR(255) NOT NULL,
      data TEXT NULL,
      expires_at TIMESTAMP NOT NULL,
      used TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      user_id INT PRIMARY KEY,
      otp_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INT PRIMARY KEY,
      age INT NULL,
      gender VARCHAR(32) NULL,
      class_level VARCHAR(32) NULL,
      location VARCHAR(128) NULL,
      interests JSON NULL,
      academic_performance JSON NULL,
      phone VARCHAR(20) NULL,
      address TEXT NULL,
      preferences JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      type ENUM('personal','exam','scholarship','registration','deadline') NOT NULL DEFAULT 'personal',
      description TEXT NULL,
      priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_events_user_date (user_id, event_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS colleges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      state VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      type ENUM('technology','commerce','arts','design','science','medical') NOT NULL,
      ownership ENUM('government','private') NOT NULL DEFAULT 'government',
      paths JSON NULL,
      description TEXT NULL,
      website VARCHAR(255) NULL,
      latitude DECIMAL(10,7) NULL,
      longitude DECIMAL(10,7) NULL,
      ranking INT NULL,
      fees_min INT NULL,
      fees_max INT NULL,
      exams JSON NULL,
      courses JSON NULL,
      accreditation VARCHAR(100) NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(20) NULL,
      institute_id VARCHAR(50) NULL,
      tlr DECIMAL(5,2) NULL,
      rpc DECIMAL(5,2) NULL,
      go_score DECIMAL(5,2) NULL,
      oi DECIMAL(5,2) NULL,
      perception DECIMAL(5,2) NULL,
      total_score DECIMAL(6,2) NULL,
      rank_position INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // =====================================================
  // CAREER ASSESSMENT SYSTEM TABLES (4 NEW TABLES)
  // Added for advanced multi-category career assessment
  // =====================================================

  // Table 1: career_questions - Stores assessment questions
  await connection.query(`
    CREATE TABLE IF NOT EXISTS career_questions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      category ENUM('school', 'college', 'professional') NOT NULL,
      question_text TEXT NOT NULL,
      question_type ENUM('interest', 'aptitude', 'personality', 'work_style') NOT NULL,
      difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
      weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
      options JSON NOT NULL COMMENT 'Array of 4 options with text and score_mapping',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_active (is_active),
      INDEX idx_category_active (category, is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Table 2: career_test_sessions - Track user test sessions
  await connection.query(`
    CREATE TABLE IF NOT EXISTS career_test_sessions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      category ENUM('school', 'college', 'professional') NOT NULL,
      status ENUM('in_progress', 'completed', 'abandoned') NOT NULL DEFAULT 'in_progress',
      total_questions INT NOT NULL,
      answered_questions INT NOT NULL DEFAULT 0,
      start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      completion_time TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_status (user_id, status),
      INDEX idx_category (category),
      INDEX idx_user_category (user_id, category, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Table 3: career_test_answers - Store individual answers
  await connection.query(`
    CREATE TABLE IF NOT EXISTS career_test_answers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      session_id INT NOT NULL,
      question_id INT NOT NULL,
      selected_option_index INT NOT NULL COMMENT 'Index 0-3 of selected option',
      time_spent_seconds INT NULL COMMENT 'Time spent on this question',
      answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES career_test_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES career_questions(id) ON DELETE CASCADE,
      UNIQUE KEY unique_session_question (session_id, question_id),
      INDEX idx_session (session_id),
      INDEX idx_session_question (session_id, question_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Table 4: career_test_results - Store calculated results
  await connection.query(`
    CREATE TABLE IF NOT EXISTS career_test_results (
      id INT PRIMARY KEY AUTO_INCREMENT,
      session_id INT NOT NULL UNIQUE,
      user_id INT NOT NULL,
      stream_scores JSON NOT NULL COMMENT 'Object with science, commerce, technology, arts, design percentages',
      top_streams JSON NOT NULL COMMENT 'Array of top 3 recommended streams with scores',
      confidence_level ENUM('low', 'medium', 'high') NOT NULL,
      completion_percentage DECIMAL(5,2) NOT NULL,
      recommended_colleges JSON NULL COMMENT 'Array of college suggestions',
      career_suggestions JSON NULL COMMENT 'Array of career path suggestions',
      personalized_explanations JSON NULL COMMENT 'Best-fit and second-best stream explanations with why it suits you',
      calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES career_test_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id),
      INDEX idx_confidence (confidence_level),
      INDEX idx_user_session (user_id, session_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ Career Assessment tables created successfully');

  await connection.end();

  // Create connection pool
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

  console.log(`✅ Database '${MYSQL_DATABASE}' ready, pool created`);
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call ensureDatabase() first.');
  }
  return pool;
}

export default pool;

