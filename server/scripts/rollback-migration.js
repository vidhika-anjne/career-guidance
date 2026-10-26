/**
 * ROLLBACK SCRIPT - Adaptive Test Migration
 * WARNING: This will remove the new columns and their data
 * Only run if migration needs to be reversed
 */

import { getPool } from '../db/pool.js';

async function rollbackMigration() {
    const pool = getPool();

    try {
        console.log('⚠️  Starting ROLLBACK of Adaptive Test Migration...\n');
        console.log('This will remove: education_level, class_or_year, stream_status, selected_stream\n');

        // Confirm (in production, you'd want user confirmation)
        console.log('Step 1: Removing indexes...');
        try {
            await pool.query('DROP INDEX IF EXISTS idx_selected_stream ON users');
            console.log('✅ Index idx_selected_stream removed');
        } catch (err) {
            console.log('ℹ️  Index idx_selected_stream not found');
        }

        try {
            await pool.query('DROP INDEX IF EXISTS idx_stream_status ON users');
            console.log('✅ Index idx_stream_status removed\n');
        } catch (err) {
            console.log('ℹ️  Index idx_stream_status not found\n');
        }

        // Remove columns
        console.log('Step 2: Removing columns...');
        await pool.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS education_level,
      DROP COLUMN IF EXISTS class_or_year,
      DROP COLUMN IF EXISTS stream_status,
      DROP COLUMN IF EXISTS selected_stream
    `);
        console.log('✅ Columns removed\n');

        // Verify
        console.log('Step 3: Verifying rollback...');
        const [columns] = await pool.query(`
      SELECT COUNT(*) as remaining_columns
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('education_level', 'class_or_year', 'stream_status', 'selected_stream')
    `);

        if (columns[0].remaining_columns === 0) {
            console.log('✅ Rollback successful - all adaptive test columns removed\n');
        } else {
            console.log(`⚠️  ${columns[0].remaining_columns} columns still remain\n`);
        }

        console.log('🎉 Rollback completed!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Rollback failed:', error.message);
        process.exit(1);
    }
}

rollbackMigration();
