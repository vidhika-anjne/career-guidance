/**
 * Quick script to check if user is admin in database
 * Run: node server/scripts/check-admin.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ansh';

async function checkAdmin() {
    let connection;

    try {
        console.log('🔍 Checking admin status...\n');
        connection = await mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE
        });

        // Check if role column exists
        const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'role'`);

        if (columns.length === 0) {
            console.log('❌ Role column does NOT exist in users table!');
            console.log('📝 You need to add it. Run: ALTER TABLE users ADD COLUMN role ENUM(\'student\',\'admin\') NOT NULL DEFAULT \'student\' AFTER google_id;');
            return;
        }

        console.log('✅ Role column exists in users table\n');

        // Check specific user
        const email = 'khatriansh10@gmail.com';
        const [users] = await connection.query(
            'SELECT id, name, email, role, created_at FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            console.log(`❌ User ${email} not found in database`);
            console.log('💡 Make sure you have registered with this email first');
            return;
        }

        const user = users[0];
        console.log('📊 User Information:');
        console.log('─────────────────────────────────────');
        console.log(`ID:      ${user.id}`);
        console.log(`Name:    ${user.name}`);
        console.log(`Email:   ${user.email}`);
        console.log(`Role:    ${user.role}`);
        console.log(`Joined:  ${user.created_at}`);
        console.log('─────────────────────────────────────\n');

        if (user.role === 'admin') {
            console.log('✅ User IS an admin in the database!');
            console.log('\n🔧 TROUBLESHOOTING STEPS:');
            console.log('1. Logout from the application');
            console.log('2. Login again with khatriansh10@gmail.com');
            console.log('3. Navigate to http://localhost:3000/admin');
            console.log('\n💡 Why? Your current session has an old JWT token.');
            console.log('   Logging in again will create a new token with admin role.');
        } else {
            console.log('❌ User is NOT an admin in the database');
            console.log('\n📝 To make this user admin, run:');
            console.log(`UPDATE users SET role = 'admin' WHERE email = '${email}';`);
            console.log('\nOr use a MySQL client to run the query.');
        }

        // Show all admins
        const [admins] = await connection.query(
            'SELECT id, name, email FROM users WHERE role = ?',
            ['admin']
        );

        console.log(`\n👥 Total admins in database: ${admins.length}`);
        if (admins.length > 0) {
            console.log('Admin accounts:');
            admins.forEach(admin => {
                console.log(`   - ${admin.name} (${admin.email})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log('\n💡 Users table does not exist. Make sure the server has started at least once.');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkAdmin();
