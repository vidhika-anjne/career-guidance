/**
 * Delete and re-seed college questions
 * This fixes missing Q1-Q4 issue
 */

import { getPool, ensureDatabase } from '../db/pool.js';
import { collegeQuestions } from '../../src/data/careerQuestions.js';

async function reseedCollegeQuestions() {
    try {
        console.log('🔄 Re-seeding college questions...');

        await ensureDatabase();
        const pool = getPool();

        // Delete existing college questions
        console.log('🗑️  Deleting existing college questions...');
        await pool.query('DELETE FROM career_questions WHERE category = "college"');
        console.log('✅ Deleted old questions');

        // Insert new questions
        let inserted = 0;
        let errors = 0;

        for (const question of collegeQuestions) {
            try {
                await pool.query(
                    `INSERT INTO career_questions 
           (id, category, question_text, question_type, difficulty_level, weight, options, section, stream_filter, determines_flow)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        question.id,
                        question.category,
                        question.question_text,
                        question.question_type,
                        question.difficulty_level,
                        question.weight,
                        JSON.stringify(question.options),
                        question.section || null,
                        question.stream_filter || null,
                        question.determines_flow || false
                    ]
                );
                console.log(`✅ Inserted question ID ${question.id}`);
                inserted++;
            } catch (err) {
                console.error(`❌ Error inserting question ID ${question.id}:`, err.message);
                errors++;
            }
        }

        console.log('\n📊 Re-seeding Complete!');
        console.log(`   Inserted: ${inserted}`);
        console.log(`   Errors: ${errors}`);
        console.log(`   Total: ${collegeQuestions.length}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

reseedCollegeQuestions();
