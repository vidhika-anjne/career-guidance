const mysql = require('mysql2/promise');

async function check() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    const [total] = await conn.query('SELECT COUNT(*) as cnt FROM colleges');
    console.log('Total colleges:', total[0].cnt);

    const [byType] = await conn.query('SELECT type, COUNT(*) as cnt FROM colleges GROUP BY type');
    console.log('\nBy type:');
    byType.forEach(r => console.log(`  ${r.type}: ${r.cnt}`));

    const [sample] = await conn.query('SELECT name, city, state, type FROM colleges LIMIT 5');
    console.log('\nSample colleges:');
    sample.forEach(c => console.log(`  - ${c.name} (${c.city}, ${c.state}) [${c.type}]`));

    await conn.end();
}

check();
