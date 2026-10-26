-- Migration for older MySQL versions
-- This will add columns safely

USE ansh;

-- Add columns (will error if they exist, which is fine - just continue)
ALTER TABLE users ADD COLUMN education_level VARCHAR(50) DEFAULT NULL;
ALTER TABLE users ADD COLUMN class_or_year VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL;
ALTER TABLE users ADD COLUMN selected_stream VARCHAR(50) DEFAULT NULL;

-- Add indexes (ignore errors if they exist)
CREATE INDEX idx_selected_stream ON users(selected_stream);
CREATE INDEX idx_stream_status ON users(stream_status);

-- Verify
SELECT 'Migration Complete!' as status;
