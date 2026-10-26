/**
 * Manually insert Q1 and see exact error
 */

import { getPool, ensureDatabase } from '../db/pool.js';

async function insertQ1Manually() {
    try {
        console.log('🔍 Attempting to insert Q1 (Stream Selection)...\n');

        await ensureDatabase();
        const pool = getPool();

        const q1 = {
            id: 101,
            category: 'college',
            question_text: "Which stream are you currently studying or have completed?",
            question_type: 'personality',
            difficulty_level: 'easy',
            weight: 2.00,
            section: null, // Q1 has no section (it determines the section)
            stream_filter: null,
            determines_flow: true,
            options: JSON.stringify([
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
                },
                {
                    text: "Planning to switch my field",
                    score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 },
                    next_section: 'field_switch'
                }
            ])
        };

        console.log('Q1 Data:', {
            id: q1.id,
            category: q1.category,
            question_type: q1.question_type,
            determines_flow: q1.determines_flow
        });

        await pool.query(
            `INSERT INTO career_questions 
       (id, category, question_text, question_type, difficulty_level, weight, options, section, stream_filter, determines_flow)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                q1.id,
                q1.category,
                q1.question_text,
                q1.question_type,
                q1.difficulty_level,
                q1.weight,
                q1.options,
                q1.section,
                q1.stream_filter,
                q1.determines_flow
            ]
        );

        console.log('\n✅ Q1 inserted successfully!');

        // Verify it's there
        const [check] = await pool.query('SELECT id, question_text FROM career_questions WHERE id = 101');
        if (check.length > 0) {
            console.log('✅ Verified Q1 exists in database');
            console.log('   Text:', check[0].question_text.substring(0, 50) + '...');
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR inserting Q1:');
        console.error('   Code:', error.code);
        console.error('   Message:', error.message);
        console.error('   SQL:', error.sql);
        process.exit(1);
    }
}

insertQ1Manually();
