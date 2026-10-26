/**
 * Add personalized_explanations column to career_test_results table
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function addColumn() {
    try {
        console.log('🔧 Adding personalized_explanations column...');

        await ensureDatabase();
        const pool = getPool();

        // Check if column exists
        const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'ansh' 
      AND TABLE_NAME = 'career_test_results' 
      AND COLUMN_NAME = 'personalized_explanations'
    `);

        if (columns.length > 0) {
            console.log('✅ Column already exists!');
        } else {
            // Add column
            await pool.query(`
        ALTER TABLE career_test_results 
        ADD COLUMN personalized_explanations JSON NULL 
        AFTER career_suggestions
      `);
            console.log('✅ Column added successfully!');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addColumn();
