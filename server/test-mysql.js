// MySQL Connection Test Script
// This will help you find the correct MySQL password

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testPasswords = ['', 'root', 'password', 'admin', 'mysql', '123456', 'root123'];

console.log('🔍 Testing MySQL Connection...\n');
console.log('Configuration from .env:');
console.log(`  Host: ${process.env.MYSQL_HOST || 'localhost'}`);
console.log(`  Port: ${process.env.MYSQL_PORT || 3306}`);
console.log(`  User: ${process.env.MYSQL_USER || 'root'}`);
console.log(`  Password: ${process.env.MYSQL_PASSWORD ? '***SET***' : 'EMPTY'}`);
console.log(`  Database: ${process.env.MYSQL_DATABASE || 'ansh'}\n`);

async function testConnection(password) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            port: Number(process.env.MYSQL_PORT || 3306),
            user: process.env.MYSQL_USER || 'root',
            password: password,
        });
        await connection.query('SELECT 1');
        await connection.end();
        return true;
    } catch (error) {
        return false;
    }
}

async function findWorkingPassword() {
    console.log('🧪 Testing current .env password...');
    const currentPassword = process.env.MYSQL_PASSWORD || '';
    const currentWorks = await testConnection(currentPassword);

    if (currentWorks) {
        console.log('✅ SUCCESS! Current password in .env works!\n');
        console.log('Your server should start now. Try running: npm run dev\n');
        return;
    }

    console.log('❌ Current password does not work.\n');
    console.log('🔍 Testing common passwords...\n');

    for (const pwd of testPasswords) {
        const displayPwd = pwd === '' ? '(empty)' : pwd;
        process.stdout.write(`  Testing "${displayPwd}"...`);

        const works = await testConnection(pwd);

        if (works) {
            console.log(' ✅ SUCCESS!\n');
            console.log('━'.repeat(60));
            console.log('✅ FOUND WORKING PASSWORD!\n');
            console.log('Update your server/.env file with:');
            console.log(`  MYSQL_PASSWORD=${pwd}\n`);
            console.log('Then restart the server with: npm run dev');
            console.log('━'.repeat(60));
            return;
        } else {
            console.log(' ❌ failed');
        }
    }

    console.log('\n❌ None of the common passwords worked.\n');
    console.log('📋 Next steps:');
    console.log('  1. Reset your MySQL password using MySQL Installer');
    console.log('  2. Or use MySQL Workbench to connect and reset password');
    console.log('  3. Or create a new MySQL user for this project\n');
}

findWorkingPassword().catch(err => {
    console.error('Error during testing:', err.message);
    process.exit(1);
});
