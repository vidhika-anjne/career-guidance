-- ROLLBACK SCRIPT - Use ONLY if migration needs to be reversed
-- WARNING: This will remove columns and their data

-- Remove indexes
DROP INDEX IF EXISTS idx_selected_stream ON users;
DROP INDEX IF EXISTS idx_stream_status ON users;

-- Remove columns
ALTER TABLE users 
DROP COLUMN IF EXISTS education_level,
DROP COLUMN IF EXISTS class_or_year,
DROP COLUMN IF EXISTS stream_status,
DROP COLUMN IF EXISTS selected_stream;

-- Verify rollback
SELECT 
    COUNT(*) as stream_columns_remaining
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
AND COLUMN_NAME IN ('education_level', 'class_or_year', 'stream_status', 'selected_stream');
-- Should return 0
