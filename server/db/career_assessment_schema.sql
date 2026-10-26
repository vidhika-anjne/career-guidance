-- =====================================================
-- Advanced Career Assessment System
-- Database Schema
-- CS508 Minor Project I
-- =====================================================

-- Table 1: career_questions
-- Purpose: Store all assessment questions for 3 user categories
-- Categories: school (Class 8-12), college, professional
-- =====================================================

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
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 2: career_test_sessions
-- Purpose: Track each user's test session for pause/resume
-- Status: in_progress, completed, abandoned
-- =====================================================

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
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 3: career_test_answers
-- Purpose: Store individual answers for each question
-- Enables partial test completion and result calculation
-- =====================================================

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
  INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 4: career_test_results
-- Purpose: Store calculated results with recommendations
-- Includes: stream scores, confidence level, suggestions
-- =====================================================

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
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES career_test_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_confidence (confidence_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Questions lookup by category
ALTER TABLE career_questions ADD INDEX idx_category_active (category, is_active);

-- Session lookup by user and status
ALTER TABLE career_test_sessions ADD INDEX idx_user_category (user_id, category, status);

-- Answers aggregation by session
ALTER TABLE career_test_answers ADD INDEX idx_session_question (session_id, question_id);

-- Results lookup by user
ALTER TABLE career_test_results ADD INDEX idx_user_session (user_id, session_id);

-- =====================================================
-- Sample Data Comments (for reference)
-- =====================================================

/*
OPTIONS JSON STRUCTURE:
[
  {
    "text": "Option text here",
    "score_mapping": {
      "science": 3,
      "commerce": 0,
      "technology": 2,
      "arts": 0,
      "design": 1
    }
  },
  ... (3 more options)
]

STREAM_SCORES JSON STRUCTURE:
{
  "science": 85,
  "commerce": 45,
  "technology": 78,
  "arts": 32,
  "design": 50
}

TOP_STREAMS JSON STRUCTURE:
[
  { "stream": "science", "score": 85, "rank": 1 },
  { "stream": "technology", "score": 78, "rank": 2 },
  { "stream": "design", "score": 50, "rank": 3 }
]
*/
