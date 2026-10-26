const mysql = require('mysql2/promise');

async function checkOTPTable() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    console.log('🔍 Checking email_otps table structure:\n');

    const [cols] = await conn.query('DESCRIBE email_otps');
    console.log('Columns:');
    cols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));

    await conn.end();
}

checkOTPTable();
