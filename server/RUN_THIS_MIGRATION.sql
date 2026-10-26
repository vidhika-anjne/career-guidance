-- ADAPTIVE TEST MIGRATION
-- Copy and paste this ENTIRE block into MySQL command line

USE ansh;

-- Add each column separately
ALTER TABLE users ADD COLUMN education_level VARCHAR(50) DEFAULT NULL;
ALTER TABLE users ADD COLUMN class_or_year VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL;
ALTER TABLE users ADD COLUMN selected_stream VARCHAR(50) DEFAULT NULL;

-- Add indexes
CREATE INDEX idx_selected_stream ON users(selected_stream);
CREATE INDEX idx_stream_status ON users(stream_status);

-- Show success
SELECT 'SUCCESS! Columns added. Now restart your servers.' AS message;

-- Verify columns exist
SHOW COLUMNS FROM users LIKE '%stream%';
SHOW COLUMNS FROM users LIKE '%education%';
SHOW COLUMNS FROM users LIKE '%class%';
