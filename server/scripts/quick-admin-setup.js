/**
 * Quick setup script to add role column and set admin user
 * Run: node server/scripts/quick-admin-setup.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ansh';

const ADMIN_EMAIL = 'khatriansh10@gmail.com';

async function setup() {
    let connection;

    try {
        console.log('🔧 Setting up admin access...\n');
        connection = await mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE
        });

        // Step 1: Check if role column exists
        const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'role'`);

        if (columns.length === 0) {
            console.log('📝 Adding role column to users table...');
            await connection.query(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('student','admin') NOT NULL DEFAULT 'student' 
        AFTER google_id
      `);
            console.log('✅ Role column added successfully!\n');
        } else {
            console.log('✅ Role column already exists\n');
        }

        // Step 2: Make user admin
        console.log(`📝 Setting ${ADMIN_EMAIL} as admin...`);
        const [result] = await connection.query(
            `UPDATE users SET role = 'admin' WHERE email = ?`,
            [ADMIN_EMAIL]
        );

        if (result.affectedRows === 0) {
            console.log(`❌ User ${ADMIN_EMAIL} not found in database!`);
            console.log('💡 Please register with this email first, then run this script again.\n');
            return;
        }

        console.log('✅ User set as admin successfully!\n');

        // Step 3: Verify
        const [users] = await connection.query(
            'SELECT id, name, email, role FROM users WHERE email = ?',
            [ADMIN_EMAIL]
        );

        if (users[0]) {
            console.log('📊 Admin User Details:');
            console.log('─────────────────────────────────────');
            console.log(`ID:    ${users[0].id}`);
            console.log(`Name:  ${users[0].name}`);
            console.log(`Email: ${users[0].email}`);
            console.log(`Role:  ${users[0].role}`);
            console.log('─────────────────────────────────────\n');
        }

        console.log('✨ Setup complete! Next steps:');
        console.log('1. Logout if currently logged in');
        console.log('2. Login again with your credentials');
        console.log('3. Navigate to http://localhost:3000/admin');
        console.log('\n🎉 You should now see the admin dashboard!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️  Role column already exists (this is OK)');
            console.log('Continuing with admin user setup...\n');
            // Try to set admin anyway
            try {
                const [result] = await connection.query(
                    `UPDATE users SET role = 'admin' WHERE email = ?`,
                    [ADMIN_EMAIL]
                );
                if (result.affectedRows > 0) {
                    console.log('✅ User set as admin!');
                }
            } catch (e) {
                console.error('Failed to set admin:', e.message);
            }
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setup();
