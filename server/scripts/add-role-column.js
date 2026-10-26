/**
 * ADMIN MODULE - Database Migration Script
 * 
 * This script safely adds the 'role' column to existing users table.
 * Run this ONCE if you have an existing database.
 * 
 * Usage: node server/scripts/add-role-column.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ansh';

async function migrateDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE
        });

        console.log('✅ Connected to database');

        // Check if role column already exists
        const [columns] = await connection.query(
            `SHOW COLUMNS FROM users LIKE 'role'`
        );

        if (columns.length > 0) {
            console.log('⚠️  Role column already exists. No migration needed.');
            return;
        }

        console.log('🔄 Adding role column to users table...');

        // Add role column with default value 'student'
        await connection.query(`
      ALTER TABLE users 
      ADD COLUMN role ENUM('student','admin') NOT NULL DEFAULT 'student'
      AFTER google_id
    `);

        console.log('✅ Successfully added role column!');

        // Show current user count
        const [result] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`📊 All ${result[0].count} existing users have been set to role='student'`);

        console.log('\n✨ Migration completed successfully!');
        console.log('💡 To create an admin user, run this SQL command:');
        console.log('   UPDATE users SET role = \'admin\' WHERE email = \'your-email@gmail.com\';');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔒 Database connection closed');
        }
    }
}

migrateDatabase();
