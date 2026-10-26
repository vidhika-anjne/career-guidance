-- Adaptive Aptitude Test System - Database Migration
-- Adds support for stream-based personalized testing
-- All columns are NULLABLE to maintain backward compatibility

-- Step 1: Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS education_level VARCHAR(50) DEFAULT NULL COMMENT 'School or College',
ADD COLUMN IF NOT EXISTS class_or_year VARCHAR(20) DEFAULT NULL COMMENT '9, 10, 11, 12, UG Year 1-4, PG Year 1-2',
ADD COLUMN IF NOT EXISTS stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL COMMENT 'Whether user has selected a stream',
ADD COLUMN IF NOT EXISTS selected_stream VARCHAR(50) DEFAULT NULL COMMENT 'Science, Commerce, Arts, Engineering, Medical, Management';

-- Step 2: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_selected_stream ON users(selected_stream);
CREATE INDEX IF NOT EXISTS idx_stream_status ON users(stream_status);

-- Step 3: Verify columns added
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('education_level', 'class_or_year', 'stream_status', 'selected_stream');

-- Step 4: Verify existing users are unaffected (all should have NULL values)
SELECT COUNT(*) as existing_users_with_null_stream 
FROM users 
WHERE education_level IS NULL 
AND class_or_year IS NULL 
AND stream_status IS NULL 
AND selected_stream IS NULL;
