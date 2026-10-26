/**
 * Simple script - delete all college questions and insert ONLY Q1-Q4
 * This will let us test if Q1-Q4 specifically have issues
 */

import { getPool, ensureDatabase } from '../db/pool.js';

const q1to4 = [
    {
        id: 101,
        category: 'college',
        question_text: "Which stream are you currently studying or have completed?",
        question_type: 'personality',
        difficulty_level: 'easy',
        weight: 2.00,
        section: null,
        stream_filter: null,
        determines_flow: 1,
        options: [
            { text: "Engineering / Technology", score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 }, next_section: 'engineering' },
            { text: "Medical / Life Sciences", score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 }, next_section: 'medical' },
            { text: "Commerce / Management", score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 }, next_section: 'commerce' },
            { text: "Arts / Humanities", score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }, next_section: 'arts' },
            { text: "Design / Creative Fields", score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 }, next_section: 'design' },
            { text: "Planning to switch my field", score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 }, next_section: 'field_switch' }
        ]
    },
    {
        id: 102,
        category: 'college',
        question_text: "What is your primary goal right now?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.50,
        section: 'common',
        stream_filter: null,
        determines_flow: 0,
        options: [
            { text: "Specialize further in my current field", score_mapping: { science: 3, commerce: 2, technology: 3, arts: 2, design: 2 } },
            { text: "Explore multiple career options", score_mapping: { science: 1, commerce: 2, technology: 2, arts: 3, design: 2 } },
            { text: "Switch to a different field", score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 } },
            { text: "Prepare for higher studies (India / Abroad)", score_mapping: { science: 3, commerce: 2, technology: 2, arts: 2, design: 2 } }
        ]
    },
    {
        id: 103,
        category: 'college',
        question_text: "What matters most to you at this stage?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'common',
        stream_filter: null,
        determines_flow: 0,
        options: [
            { text: "High-paying career", score_mapping: { science: 1, commerce: 3, technology: 3, arts: 0, design: 1 } },
            { text: "Job stability and security", score_mapping: { science: 2, commerce: 3, technology: 2, arts: 1, design: 1 } },
            { text: "Personal interest & satisfaction", score_mapping: { science: 2, commerce: 1, technology: 2, arts: 3, design: 3 } },
            { text: "Social impact and meaningful work", score_mapping: { science: 3, commerce: 0, technology: 1, arts: 3, design: 2 } }
        ]
    },
    {
        id: 104,
        category: 'college',
        question_text: "What kind of work environment do you prefer?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.10,
        section: 'common',
        stream_filter: null,
        determines_flow: 0,
        options: [
            { text: "Corporate / Tech company", score_mapping: { science: 1, commerce: 3, technology: 3, arts: 1, design: 2 } },
            { text: "Research lab / Academia", score_mapping: { science: 3, commerce: 0, technology: 2, arts: 2, design: 1 } },
            { text: "Startup / Entrepreneurial", score_mapping: { science: 1, commerce: 3, technology: 3, arts: 2, design: 3 } },
            { text: "Public sector / Social sector", score_mapping: { science: 2, commerce: 1, technology: 0, arts: 3, design: 1 } }
        ]
    }
];

async function insertQ1to4Only() {
    try {
        console.log('🔄 Inserting Q1-Q4 specifically...\n');

        await ensureDatabase();
        const pool = getPool();

        let success = 0;
        let failed = 0;

        for (const q of q1to4) {
            try {
                await pool.query(
                    `INSERT INTO career_questions 
           (id, category, question_text, question_type, difficulty_level, weight, options, section, stream_filter, determines_flow)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           question_text = VALUES(question_text),
           section = VALUES(section),
           stream_filter = VALUES(stream_filter),
           determines_flow = VALUES(determines_flow)`,
                    [
                        q.id,
                        q.category,
                        q.question_text,
                        q.question_type,
                        q.difficulty_level,
                        q.weight,
                        JSON.stringify(q.options),
                        q.section,
                        q.stream_filter,
                        q.determines_flow
                    ]
                );
                console.log(`✅ Q${q.id - 100} (ID ${q.id}) inserted/updated`);
                success++;
            } catch (err) {
                console.error(`❌ Q${q.id - 100} (ID ${q.id}) FAILED:`, err.message);
                failed++;
            }
        }

        console.log(`\n📊 Result: ${success} success, ${failed} failed`);

        // Verify
        const [check] = await pool.query('SELECT id, question_text FROM career_questions WHERE id BETWEEN 101 AND 104 ORDER BY id');
        console.log('\n✅ Q1-Q4 in database:', check.map(q => q.id).join(', '));

        process.exit(0);

    } catch (error) {
        console.error('Fatal:', error);
        process.exit(1);
    }
}

insertQ1to4Only();
