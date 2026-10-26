const mysql = require('mysql2/promise');

async function directTest() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    console.log('🔍 Testing direct SQL query:\n');

    const sql = `SELECT id, name, state, city, type, ownership, institute_id, tlr, rpc, go_score, oi, perception, total_score, rank_position
               FROM colleges WHERE total_score IS NOT NULL LIMIT 2`;

    const [rows] = await conn.query(sql);

    console.log('📊 Query returned', rows.length, 'rows\n');

    rows.forEach(college => {
        console.log(`College: ${college.name}`);
        console.log(`  ID: ${college.id}`);
        console.log(`  Institute ID: ${college.institute_id}`);
        console.log(`  TLR: ${college.tlr}`);
        console.log(`  RPC: ${college.rpc}`);
        console.log(`  GO: ${college.go_score}`);
        console.log(`  OI: ${college.oi}`);
        console.log(`  Perception: ${college.perception}`);
        console.log(`  Total Score: ${college.total_score}`);
        console.log(`  Rank: ${college.rank_position}\n`);
    });

    await conn.end();
}

directTest();
