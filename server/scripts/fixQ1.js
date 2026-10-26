/**
 * Simple script to update Q1 - CommonJS version
 */

const mysql = require('mysql2/promise');

async function updateQ1() {
    let conn;
    try {
        console.log('🔄 Updating Q1...');

        conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ansh'
        });

        const q1 = [
            { text: "Engineering / Technology", score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 }, next_section: 'engineering' },
            { text: "Medical / Life Sciences", score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 }, next_section: 'medical' },
            { text: "Commerce / Management", score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 }, next_section: 'commerce' },
            { text: "Arts / Humanities", score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }, next_section: 'arts' },
            { text: "Design / Creative Fields", score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 }, next_section: 'design' }
        ];

        await conn.query('UPDATE career_questions SET options = ? WHERE id = 101', [JSON.stringify(q1)]);

        const [check] = await conn.query('SELECT options FROM career_questions WHERE id = 101');
        const opts = JSON.parse(check[0].options);

        console.log('✅ Q1 updated!');
        console.log('   Now has', opts.length, 'options');
        opts.forEach((o, i) => console.log(`   ${i + 1}. ${o.text}`));

        await conn.end();
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (conn) await conn.end();
        process.exit(1);
    }
}

updateQ1();
