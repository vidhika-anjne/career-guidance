/**
 * SEED CAREER QUESTIONS SCRIPT
 * Populates database with career assessment questions
 * CS508 Minor Project I
 * 
 * Usage: node scripts/seedCareerQuestions.js
 */

import { getPool, ensureDatabase } from '../db/pool.js';
import { allCareerQuestions, validateQuestion } from '../../src/data/careerQuestions.js';

async function seedQuestions() {
    try {
        console.log('🌱 Starting Career Questions Seeding...\n');

        // Ensure database is ready
        await ensureDatabase();
        const pool = getPool();

        let inserted = 0;
        let skipped = 0;
        let errors = 0;

        for (const question of allCareerQuestions) {
            try {
                // Validate question structure
                if (!validateQuestion(question)) {
                    console.log(`⚠️  Skipping invalid question ID ${question.id}`);
                    skipped++;
                    continue;
                }

                // Check if question already exists
                const [existing] = await pool.query(
                    'SELECT id FROM career_questions WHERE id = ?',
                    [question.id]
                );

                if (existing.length > 0) {
                    console.log(`ℹ️  Question ID ${question.id} already exists, skipping...`);
                    skipped++;
                    continue;
                }

                // Insert question
                await pool.query(
                    `INSERT INTO career_questions 
           (id, category, question_text, question_type, difficulty_level, weight, options)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        question.id,
                        question.category,
                        question.question_text,
                        question.question_type,
                        question.difficulty_level,
                        question.weight,
                        JSON.stringify(question.options)
                    ]
                );

                console.log(`✅ Inserted question ID ${question.id} (${question.category})`);
                inserted++;

            } catch (error) {
                console.error(`❌ Error inserting question ID ${question.id}:`, error.message);
                errors++;
            }
        }

        console.log(`\n📊 Seeding Complete!`);
        console.log(`   Inserted: ${inserted}`);
        console.log(`   Skipped: ${skipped}`);
        console.log(`   Errors: ${errors}`);
        console.log(`   Total: ${allCareerQuestions.length}\n`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding
seedQuestions();
