/**
 * Update Q1 in database to have only 5 options (remove field switch)
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function updateQ1() {
    try {
        console.log('🔄 Updating Q1 to remove field-switch option...\n');

        await ensureDatabase();
        const pool = getPool();

        const q1Options = [
            {
                text: "Engineering / Technology",
                score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 },
                next_section: 'engineering'
            },
            {
                text: "Medical / Life Sciences",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 },
                next_section: 'medical'
            },
            {
                text: "Commerce / Management",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 },
                next_section: 'commerce'
            },
            {
                text: "Arts / Humanities",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 },
                next_section: 'arts'
            },
            {
                text: "Design / Creative Fields",
                score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 },
                next_section: 'design'
            }
        ];

        await pool.query(
            `UPDATE career_questions 
       SET options = ?
       WHERE id = 101`,
            [JSON.stringify(q1Options)]
        );

        console.log('✅ Q1 updated to 5 options\n');

        // Verify
        const [check] = await pool.query('SELECT options FROM career_questions WHERE id = 101');
        const opts = JSON.parse(check[0].options);
        console.log('✅ Verified - Q1 now has', opts.length, 'options:');
        opts.forEach((opt, i) => console.log(`   ${i + 1}. ${opt.text}`));

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateQ1();
