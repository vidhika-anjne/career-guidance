const mysql = require('mysql2/promise');

async function cleanup() {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ansh'
        });

        // Delete Q125-Q126 (field switch questions)
        await conn.query('DELETE FROM career_questions WHERE id IN (125, 126)');
        console.log('✅ Deleted Q125-Q126 (field-switch questions)');

        // Update Q1 to have only 5 options
        const q1Options = [
            { text: "Engineering / Technology", score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 }, next_section: 'engineering' },
            { text: "Medical / Life Sciences", score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 }, next_section: 'medical' },
            { text: "Commerce / Management", score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 }, next_section: 'commerce' },
            { text: "Arts / Humanities", score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }, next_section: 'arts' },
            { text: "Design / Creative Fields", score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 }, next_section: 'design' }
        ];

        await conn.query('UPDATE career_questions SET options = ? WHERE id = 101', [JSON.stringify(q1Options)]);
        console.log('✅ Updated Q1 to have only 5 options');

        // Verify final count
        const [count] = await conn.query('SELECT COUNT(*) as cnt FROM career_questions WHERE category = "college"');
        console.log('✅ Total college questions:', count[0].cnt);

        // Show Q1 options
        const [q1] = await conn.query('SELECT options FROM career_questions WHERE id = 101');
        const opts = JSON.parse(q1[0].options);
        console.log('\n📋 Q1 now has', opts.length, 'options:');
        opts.forEach((o, i) => console.log(`   ${i + 1}. ${o.text}`));

        await conn.end();
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (conn) await conn.end();
        process.exit(1);
    }
}

cleanup();
