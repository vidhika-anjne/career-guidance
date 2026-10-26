/**
 * Adaptive Test Migration via API
 * Uses existing backend connection
 */

import { getPool } from '../db/pool.js';

async function runMigration() {
    try {
        const pool = getPool();
        console.log('🔄 Starting Adaptive Test Migration...\n');

        // Step 1: Add columns
        console.log('Adding columns...');
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS education_level VARCHAR(50) DEFAULT NULL COMMENT 'School or College',
      ADD COLUMN IF NOT EXISTS class_or_year VARCHAR(20) DEFAULT NULL COMMENT '9-12, UG, PG',
      ADD COLUMN IF NOT EXISTS stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS selected_stream VARCHAR(50) DEFAULT NULL
    `);
        console.log('✅ Columns added\n');

        // Step 2: Add indexes
        console.log('Adding indexes...');
        try {
            await pool.query('CREATE INDEX idx_selected_stream ON users(selected_stream)');
        } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
        try {
            await pool.query('CREATE INDEX idx_stream_status ON users(stream_status)');
        } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
        console.log('✅ Indexes added\n');

        // Step 3: Verify
        const [cols] = await pool.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('education_level','class_or_year','stream_status','selected_stream')
    `);

        console.log(`✅ Verified: ${cols.length}/4 columns\n`);
        console.log('🎉 Migration Complete!\n');
        console.log('System ready for adaptive testing.\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

// Wait for pool then run
setTimeout(runMigration, 1000);
