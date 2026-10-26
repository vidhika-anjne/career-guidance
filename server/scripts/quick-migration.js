/**
 * Quick Database Migration - Adaptive Test System
 * Run with: node --experimental-modules server/scripts/quick-migration.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function quickMigration() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'ansh',
        multipleStatements: true
    });

    try {
        console.log('🔄 Starting migration...\n');

        // Add columns
        await connection.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS education_level VARCHAR(50) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS class_or_year VARCHAR(20) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS stream_status ENUM('Selected', 'Not Selected') DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS selected_stream VARCHAR(50) DEFAULT NULL
    `);
        console.log('✅ Columns added\n');

        // Add indexes
        try {
            await connection.query('CREATE INDEX idx_selected_stream ON users(selected_stream)');
            await connection.query('CREATE INDEX idx_stream_status ON users(stream_status)');
            console.log('✅ Indexes created\n');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  Indexes already exist\n');
            }
        }

        // Verify
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('education_level', 'class_or_year', 'stream_status', 'selected_stream')
    `);

        console.log(`✅ Verified: ${columns.length}/4 columns present`);
        columns.forEach(c => console.log(`   - ${c.COLUMN_NAME}`));

        console.log('\n🎉 Migration successful!\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

quickMigration().catch(console.error);
