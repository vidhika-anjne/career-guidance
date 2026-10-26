/**
 * Check which college questions are in the database
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function checkCollegeQuestions() {
    try {
        await ensureDatabase();
        const pool = getPool();

        const [questions] = await pool.query(
            'SELECT id, question_text, section, stream_filter FROM career_questions WHERE category = "college" ORDER BY id'
        );

        console.log('\n📊 College Questions in Database:\n');
        console.log('Total:', questions.length);
        console.log('\nQuestion IDs:');
        questions.forEach(q => {
            console.log(`  ID ${q.id}: ${q.question_text.substring(0, 50)}... [${q.section || 'no section'}] [${q.stream_filter || 'no filter'}]`);
        });

        // Check if Q1 exists
        const q1 = questions.find(q => q.id === 101);
        if (q1) {
            console.log('\n✅ Q1 (Stream Selection) EXISTS');
        } else {
            console.log('\n❌ Q1 (Stream Selection) MISSING');
        }

        // Check common questions
        const common = questions.filter(q => q.section === 'common');
        console.log(`\n📋 Common questions: ${common.length}`);
        common.forEach(q => console.log(`  - ID ${q.id}: ${q.question_text.substring(0, 40)}...`));

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCollegeQuestions();
