/**
 * Add dynamic flow columns to career_questions table
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function addDynamicFlowColumns() {
    try {
        console.log('🔧 Adding dynamic flow columns to career_questions table...');

        await ensureDatabase();
        const pool = getPool();

        // Add section column
        try {
            await pool.query(`
        ALTER TABLE career_questions 
        ADD COLUMN section VARCHAR(50) NULL AFTER weight
      `);
            console.log('✅ Added section column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  section column already exists');
            } else {
                throw err;
            }
        }

        // Add stream_filter column
        try {
            await pool.query(`
        ALTER TABLE career_questions 
        ADD COLUMN stream_filter VARCHAR(50) NULL AFTER section
      `);
            console.log('✅ Added stream_filter column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  stream_filter column already exists');
            } else {
                throw err;
            }
        }

        // Add determines_flow column
        try {
            await pool.query(`
        ALTER TABLE career_questions 
        ADD COLUMN determines_flow TINYINT(1) DEFAULT 0 AFTER stream_filter
      `);
            console.log('✅ Added determines_flow column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  determines_flow column already exists');
            } else {
                throw err;
            }
        }

        console.log('\n✅ All columns added successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addDynamicFlowColumns();
