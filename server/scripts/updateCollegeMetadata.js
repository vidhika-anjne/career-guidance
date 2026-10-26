/**
 * UPDATE existing college questions with correct section and stream_filter
 */

import { getPool, ensureDatabase } from '../db/pool.js';
import { collegeQuestions } from '../../src/data/careerQuestions.js';

async function updateCollegeMetadata() {
    try {
        console.log('🔄 Updating college questions with section and stream_filter...\n');

        await ensureDatabase();
        const pool = getPool();

        let updated = 0;
        let errors = 0;

        for (const question of collegeQuestions) {
            try {
                const result = await pool.query(
                    `UPDATE career_questions 
           SET section = ?, stream_filter = ?, determines_flow = ?
           WHERE id = ?`,
                    [
                        question.section || null,
                        question.stream_filter || null,
                        question.determines_flow ? 1 : 0,
                        question.id
                    ]
                );

                if (result[0].affectedRows > 0) {
                    console.log(`✅ Updated Q${question.id}: section=${question.section || 'null'}, filter=${question.stream_filter || 'null'}`);
                    updated++;
                } else {
                    console.log(`⚠️  Q${question.id} not found in database`);
                }
            } catch (err) {
                console.error(`❌ Error updating Q${question.id}:`, err.message);
                errors++;
            }
        }

        console.log(`\n📊 Update Complete!`);
        console.log(`   Updated: ${updated}`);
        console.log(`   Errors: ${errors}`);
        console.log(`   Total: ${collegeQuestions.length}`);

        // Verify
        const [check] = await pool.query(
            'SELECT id, section, stream_filter FROM career_questions WHERE category = "college" ORDER BY id'
        );
        console.log('\n✅ Verification:');
        console.log('   Common questions:', check.filter(q => q.section === 'common').length);
        console.log('   Engineering questions:', check.filter(q => q.stream_filter === 'engineering').length);
        console.log('   Medical questions:', check.filter(q => q.stream_filter === 'medical').length);
        console.log('   Commerce questions:', check.filter(q => q.stream_filter === 'commerce').length);
        console.log('   Arts questions:', check.filter(q => q.stream_filter === 'arts').length);
        console.log('   Design questions:', check.filter(q => q.stream_filter === 'design').length);

        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

updateCollegeMetadata();
