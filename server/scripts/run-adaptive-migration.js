/**
 * Database Migration Script - Adaptive Aptitude Test System
 * Adds 4 new nullable columns to users table for stream-based personalization
 * Safe to run - all columns default to NULL
 */

import { getPool } from '../db/pool.js';

async function runMigration() {
    const pool = getPool();

    try {
        console.log('🔄 Starting Adaptive Test System Migration...\n');

        // Step 1: Add new columns
        console.log('Step 1: Adding new columns to users table...');
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS education_level VARCHAR(50) DEFAULT NULL COMMENT 'School or College',
      ADD COLUMN IF NOT EXISTS class_or_year VARCHAR(20) DEFAULT NULL COMMENT '9, 10, 11, 12, UG, PG',
      ADD COLUMN IF NOT EXISTS stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL COMMENT 'Whether user has selected a stream',
      ADD COLUMN IF NOT EXISTS selected_stream VARCHAR(50) DEFAULT NULL COMMENT 'Science, Commerce, Arts, Engineering, Medical, Management'
    `);
        console.log('✅ Columns added successfully\n');

        // Step 2: Add indexes
        console.log('Step 2: Adding indexes for performance...');
        try {
            await pool.query('CREATE INDEX idx_selected_stream ON users(selected_stream)');
            console.log('✅ Index idx_selected_stream created');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  Index idx_selected_stream already exists');
            } else {
                throw err;
            }
        }

        try {
            await pool.query('CREATE INDEX idx_stream_status ON users(stream_status)');
            console.log('✅ Index idx_stream_status created\n');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  Index idx_stream_status already exists\n');
            } else {
                throw err;
            }
        }

        // Step 3: Verify columns
        console.log('Step 3: Verifying migration...');
        const [columns] = await pool.query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_DEFAULT,
        COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('education_level', 'class_or_year', 'stream_status', 'selected_stream')
      ORDER BY COLUMN_NAME
    `);

        if (columns.length === 4) {
            console.log('✅ All 4 columns verified:\n');
            columns.forEach(col => {
                console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE})`);
            });
        } else {
            console.log(`⚠️  Expected 4 columns, found ${columns.length}`);
        }

        // Step 4: Check existing users
        console.log('\nStep 4: Checking existing users...');
        const [userCount] = await pool.query(`
      SELECT COUNT(*) as total_users,
             SUM(CASE WHEN education_level IS NULL THEN 1 ELSE 0 END) as users_with_null
      FROM users
    `);

        console.log(`✅ Total users: ${userCount[0].total_users}`);
        console.log(`✅ Users with NULL stream fields: ${userCount[0].users_with_null}`);
        console.log('   (These users will get common aptitude test)\n');

        console.log('🎉 Migration completed successfully!\n');
        console.log('📋 Summary:');
        console.log('   - 4 new columns added to users table');
        console.log('   - All columns are nullable (backward compatible)');
        console.log('   - Existing users unaffected (NULL values)');
        console.log('   - Indexes created for performance');
        console.log('   - System ready for adaptive testing!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\n🔄 Rollback instructions:');
        console.error('   Run: node server/scripts/rollback-migration.js\n');
        process.exit(1);
    }
}

runMigration();
