const mysql = require('mysql2/promise');

async function cleanup() {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'abcd',  // Update from pool.js
            database: 'ansh'
        });

        console.log('🔄 Removing field-switch questions...\n');

        // Delete Q125-Q126
        await conn.query('DELETE FROM career_questions WHERE id IN (125, 126)');
        console.log('✅ Deleted Q125-Q126');

        // Update Q1  
        const q1 = [
            { text: "Engineering / Technology", score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 }, next_section: 'engineering' },
            { text: "Medical / Life Sciences", score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 }, next_section: 'medical' },
            { text: "Commerce / Management", score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 }, next_section: 'commerce' },
            { text: "Arts / Humanities", score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }, next_section: 'arts' },
            { text: "Design / Creative Fields", score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 }, next_section: 'design' }
        ];

        await conn.query('UPDATE career_questions SET options = ? WHERE id = 101', [JSON.stringify(q1)]);
        console.log('✅ Updated Q1 to 5 options');

        const [cnt] = await conn.query('SELECT COUNT(*) as c FROM career_questions WHERE category = "college"');
        console.log('\n📊 Final count:', cnt[0].c, 'college questions');

        // Show Q1
        const [check] = await conn.query('SELECT options FROM career_questions WHERE id = 101');
        const opts = JSON.parse(check[0].options);
        console.log('\n✅ Q1 options:');
        opts.forEach((o, i) => console.log(`   ${i + 1}. ${o.text}`));

        await conn.end();
        console.log('\n✅ Complete!');

    } catch (err) {
        console.error('❌', err.message);
        if (conn) await conn.end();
    }
}

cleanup();
