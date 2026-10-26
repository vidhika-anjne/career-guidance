-- =====================================================
-- ADMIN PORTAL SETUP - SQL SCRIPT
-- Run this in your MySQL client to set up admin access
-- =====================================================

-- 1. Use the correct database
USE ansh;

-- 2. Check if role column exists (will show error if it doesn't - that's OK)
DESCRIBE users;

-- 3. Add role column if it doesn't exist
-- (If you get an error that column already exists, that's fine - skip to step 4)
ALTER TABLE users 
ADD COLUMN role ENUM('student','admin') NOT NULL DEFAULT 'student' 
AFTER google_id;

-- 4. Set your user as admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'khatriansh10@gmail.com';

-- 5. Verify it worked
SELECT id, name, email, role, created_at 
FROM users 
WHERE email = 'khatriansh10@gmail.com';

-- 6. Show all admin users
SELECT id, name, email, role 
FROM users 
WHERE role = 'admin';
