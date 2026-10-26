const mysql = require('mysql2/promise');

async function run() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'ansh',
            database: 'ansh'
        });

        console.log('🔄 Cleaning up...\n');

        await conn.query('DELETE FROM career_questions WHERE id IN (125, 126)');
        console.log('✅ Deleted Q125-Q126');

        const q1 = '[{"text":"Engineering / Technology","score_mapping":{"science":2,"commerce":0,"technology":3,"arts":0,"design":1},"next_section":"engineering"},{"text":"Medical / Life Sciences","score_mapping":{"science":3,"commerce":0,"technology":1,"arts":0,"design":0},"next_section":"medical"},{"text":"Commerce / Management","score_mapping":{"science":0,"commerce":3,"technology":1,"arts":1,"design":0},"next_section":"commerce"},{"text":"Arts / Humanities","score_mapping":{"science":0,"commerce":0,"technology":0,"arts":3,"design":1},"next_section":"arts"},{"text":"Design / Creative Fields","score_mapping":{"science":0,"commerce":0,"technology":1,"arts":1,"design":3},"next_section":"design"}]';

        await conn.query('UPDATE career_questions SET options = ? WHERE id = 101', [q1]);
        console.log('✅ Updated Q1');

        const [r] = await conn.query('SELECT COUNT(*) as c FROM career_questions WHERE category = "college"');
        console.log('\n✅ Total:', r[0].c, 'college questions\n');

        await conn.end();
    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();
