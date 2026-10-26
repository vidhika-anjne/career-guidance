import mysql from 'mysql2/promise';

async function clearOTPs() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'ansh',
            database: 'ansh'
        });

        console.log('🗑️  Deleting all old OTP records...');
        await connection.query('DELETE FROM email_otps');
        await connection.query('DELETE FROM password_resets');
        console.log('✅ All OTP and password reset records cleared!');
        console.log('You can now request a fresh OTP for login.');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

clearOTPs();
