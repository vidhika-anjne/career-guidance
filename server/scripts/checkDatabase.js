/**
 * Check EXACTLY what's in the database for college questions
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function checkDatabase() {
    try {
        await ensureDatabase();
        const pool = getPool();

        console.log('\n📊 College Questions in Database:\n');

        const [all] = await pool.query(
            'SELECT id, question_text, section, stream_filter FROM career_questions WHERE category = "college" ORDER BY id'
        );

        console.log(`Total: ${all.length}\n`);

        all.forEach(q => {
            const sec = q.section || 'NO SECTION';
            const filter = q.stream_filter || 'NO FILTER';
            console.log(`ID ${q.id}: ${q.question_text.substring(0, 40)}... [${sec}] [${filter}]`);
        });

        console.log('\n✅ Q1-Q4 check:');
        const q1to4 = all.filter(q => q.id >= 101 && q.id <= 104);
        if (q1to4.length === 4) {
            console.log('   ✅ All 4 questions present!');
            q1to4.forEach(q => console.log(`      ${q.id}: ${q.question_text.substring(0, 50)}`));
        } else {
            console.log(`   ❌ Only ${q1to4.length} found. Missing:`, [101, 102, 103, 104].filter(id => !q1to4.find(q => q.id === id)));
        }

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDatabase();
