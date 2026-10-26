const mysql = require('mysql2/promise');

async function checkMetrics() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    const [rows] = await conn.query('SELECT name, tlr, rpc, go_score, oi, perception, total_score, rank_position FROM colleges WHERE total_score IS NOT NULL LIMIT 5');

    console.log('\n📊 Sample colleges with metrics:\n');
    rows.forEach(c => {
        console.log(`${c.name}`);
        console.log(`  TLR: ${c.tlr} | RPC: ${c.rpc} | GO: ${c.go_score}`);
        console.log(`  OI: ${c.oi} | Perception: ${c.perception}`);
        console.log(`  Total Score: ${c.total_score} | Rank: ${c.rank_position}\n`);
    });

    const [count] = await conn.query('SELECT COUNT(*) as cnt FROM colleges WHERE total_score IS NOT NULL');
    console.log(`Total colleges with metrics: ${count[0].cnt}`);

    await conn.end();
}

checkMetrics();
