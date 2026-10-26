/**
 * CAREER ASSESSMENT CONTROLLER
 * Handles all business logic for career assessment system
 * CS508 Minor Project I
 * 
 * ENDPOINTS HANDLED:
 * - Create new test session
 * - Get questions for session
 * - Save answer
 * - Calculate and save results
 * - Retrieve results
 * - Resume session
 */

import { getPool } from '../db/pool.js';
import scoringEngine from '../utils/scoringEngine.js';
import { getUserById } from '../models/user.js';
import { determineTestType, getApplicableQuestions } from '../services/aptitudeTestService.js';
import { getStreamQuestions } from '../data/streamQuestions.js';

/**
 * CREATE TEST SESSION
 * Initializes a new career assessment session
 * 
 * FLOW (for VIVA):
 * 1. Validate user authentication
 * 2. Get questions for category from database
 * 3. Create session record
 * 4. Return session ID and question list
 * 
 * @route POST /api/career-test/start
 * @body { category: 'school'|'college' }
 */
export async function createTestSession(req, res) {
    try {
        const { category } = req.body;
        const userId = req.user.id; // From JWT authentication middleware

        // Validate category
        if (!['school', 'college'].includes(category)) {
            return res.status(400).json({
                error: 'Invalid category. Must be school or college'
            });
        }

        const pool = getPool();

        // ADAPTIVE TEST LOGIC: Get user's stream information
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Determine test type (common vs stream-specific)
        const testType = determineTestType(user);
        let questions = [];
        let isStreamSpecific = false;

        if (testType === 'stream-specific' && user.selected_stream) {
            // Load stream-specific questions
            console.log(`Loading stream-specific questions for: ${user.selected_stream}`);
            const streamQuestions = getStreamQuestions(user.selected_stream);

            if (streamQuestions && streamQuestions.length > 0) {
                // Convert stream question format to match database format
                questions = streamQuestions.map(q => ({
                    id: q.id,
                    category: category, // Use requested category
                    question_text: q.questionText,
                    question_type: q.category, // 'logical', 'interest', 'personality'
                    difficulty_level: q.difficulty,
                    weight: q.correctAnswer === -1 ? 0.5 : 1.0, // Lower weight for personality questions
                    options: q.options.map((optText, idx) => ({
                        text: optText,
                        score_mapping: q.correctAnswer === idx ? { [user.selected_stream]: 1.0 } : { [user.selected_stream]: 0.0 }
                    })),
                    section: user.selected_stream,
                    stream_filter: user.selected_stream,
                    determines_flow: false
                }));
                isStreamSpecific = true;
            } else {
                console.warn(`No stream-specific questions found for ${user.selected_stream}, falling back to common test`);
            }
        }

        // Fallback to common questions from database
        if (questions.length === 0) {
            console.log('Loading common aptitude questions from database');
            const [dbQuestions] = await pool.query(
                `SELECT id, category, question_text, question_type, difficulty_level, weight, options, section, stream_filter, determines_flow
           FROM career_questions
           WHERE category = ? AND is_active = 1
           ORDER BY id`,
                [category]
            );
            questions = dbQuestions;
        }

        if (questions.length === 0) {
            return res.status(404).json({
                error: 'No questions found for this category'
            });
        }

        // Step 2: Create test session
        const [sessionResult] = await pool.query(
            `INSERT INTO career_test_sessions (user_id, category, total_questions, status)
       VALUES (?, ?, ?, 'in_progress')`,
            [userId, category, questions.length]
        );

        const sessionId = sessionResult.insertId;

        // Step 3: Return session and questions
        res.status(201).json({
            sessionId,
            category,
            totalQuestions: questions.length,
            testType: isStreamSpecific ? 'stream-specific' : 'common', // Inform frontend
            selectedStream: isStreamSpecific ? user.selected_stream : null,
            questions: questions.map(q => {
                // MySQL JSON columns are already parsed as objects
                const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                return {
                    id: q.id,
                    text: q.question_text,
                    type: q.question_type,
                    difficulty: q.difficulty_level,
                    weight: q.weight,
                    section: q.section || null,
                    stream_filter: q.stream_filter || null,
                    determines_flow: q.determines_flow || false,
                    options: options.map((opt, idx) => ({
                        index: idx,
                        text: opt.text,
                        next_section: opt.next_section || null
                    }))
                };
            }),
            message: isStreamSpecific
                ? `Stream-specific test loaded for ${user.selected_stream}`
                : 'General aptitude test loaded'
        });

    } catch (error) {
        console.error('Error creating test session:', error);
        res.status(500).json({ error: 'Failed to create test session' });
    }
}

/**
 * SAVE ANSWER
 * Stores user's answer for a specific question
 * 
 * FLOW (for VIVA):
 * 1. Validate session exists and belongs to user
 * 2. Validate question belongs to session's category
 * 3. Insert or update answer
 * 4. Update session answered_questions count
 * 
 * @route POST /api/career-test/answer
 * @body { sessionId, questionId, optionIndex, timeSpent }
 */
export async function saveAnswer(req, res) {
    try {
        const { sessionId, questionId, optionIndex, timeSpent } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!sessionId || !questionId || optionIndex === undefined) {
            return res.status(400).json({
                error: 'Missing required fields: sessionId, questionId, optionIndex'
            });
        }

        if (optionIndex < 0 || optionIndex > 3) {
            return res.status(400).json({ error: 'Invalid option index. Must be 0-3' });
        }

        const pool = getPool();

        // Step 1: Verify session belongs to user and is in progress
        const [sessions] = await pool.query(
            `SELECT id, category, status FROM career_test_sessions 
       WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ error: 'Session not found or access denied' });
        }

        const session = sessions[0];
        if (session.status !== 'in_progress') {
            return res.status(400).json({ error: 'This session is already completed or abandoned' });
        }

        // Step 2: Verify question exists and matches session category
        const [questions] = await pool.query(
            `SELECT id FROM career_questions 
       WHERE id = ? AND category = ? AND is_active = 1`,
            [questionId, session.category]
        );

        if (questions.length === 0) {
            return res.status(404).json({ error: 'Question not found or invalid for this category' });
        }

        // Step 3: Insert or update answer (upsert)
        await pool.query(
            `INSERT INTO career_test_answers 
       (session_id, question_id, selected_option_index, time_spent_seconds)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       selected_option_index = VALUES(selected_option_index),
       time_spent_seconds = VALUES(time_spent_seconds),
       answered_at = CURRENT_TIMESTAMP`,
            [sessionId, questionId, optionIndex, timeSpent || null]
        );

        // Step 4: Update session answered count
        await pool.query(
            `UPDATE career_test_sessions 
       SET answered_questions = (
         SELECT COUNT(DISTINCT question_id) 
         FROM career_test_answers 
         WHERE session_id = ?
       )
       WHERE id = ?`,
            [sessionId, sessionId]
        );

        res.status(200).json({
            success: true,
            message: 'Answer saved successfully'
        });

    } catch (error) {
        console.error('Error saving answer:', error);
        res.status(500).json({ error: 'Failed to save answer' });
    }
}

/**
 * FINISH TEST AND CALCULATE RESULTS
 * Marks session as complete and calculates career scores
 * 
 * FLOW (for VIVA):
 * 1. Verify session belongs to user
 * 2. Get all answers with question details
 * 3. Use scoring engine to calculate results
 * 4. Get college suggestions based on top streams
 * 5. Save results to database
 * 6. Mark session as completed
 * 
 * @route POST /api/career-test/finish
 * @body { sessionId }
 */
export async function finishTestAndCalculate(req, res) {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId is required' });
        }

        const pool = getPool();

        // Step 1: Verify session
        const [sessions] = await pool.query(
            `SELECT id, category, total_questions, status 
       FROM career_test_sessions 
       WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const session = sessions[0];

        // Step 2: Get all answers with question details
        const [answers] = await pool.query(
            `SELECT 
        cta.selected_option_index,
        cq.id as question_id,
        cq.question_text,
        cq.question_type,
        cq.weight,
        cq.options
       FROM career_test_answers cta
       JOIN career_questions cq ON cta.question_id = cq.id
       WHERE cta.session_id = ?
       ORDER BY cta.answered_at`,
            [sessionId]
        );

        if (answers.length === 0) {
            return res.status(400).json({ error: 'No answers found for this session' });
        }

        // Step 3: Prepare answers for scoring engine
        const answersForScoring = answers.map(answer => {
            const options = typeof answer.options === 'string' ? JSON.parse(answer.options) : answer.options;
            return {
                question: {
                    id: answer.question_id,
                    text: answer.question_text,
                    type: answer.question_type,
                    weight: parseFloat(answer.weight),
                    options: options
                },
                selected_option_index: answer.selected_option_index
            };
        });

        // Step 4: Calculate scores using scoring engine
        const results = scoringEngine.calculateCareerScores(
            answersForScoring,
            session.total_questions
        );

        // Step 5: Generate career suggestions
        const careerSuggestions = scoringEngine.generateCareerSuggestions(
            results.topStreams,
            session.category
        );

        // Step 5b: Generate personalized explanations
        const personalizedExplanations = scoringEngine.generatePersonalizedExplanation(
            results.topStreams,
            answersForScoring,
            session.category
        );

        // Step 6: Get college suggestions based on top streams
        const topStreamNames = results.topStreams.map(s => s.stream);
        const collegeResults = await getCollegeSuggestions(topStreamNames, session.category);

        // Step 7: Save results to database
        const resultsData = {
            sessionId,
            userId,
            streamScores: results.streamScores,
            topStreams: results.topStreams,
            confidenceLevel: results.confidenceLevel,
            completionPercentage: results.completionPercentage,
            recommendedColleges: collegeResults,
            careerSuggestions,
            personalizedExplanations  // NEW: Added personalized explanations
        };

        await pool.query(
            `INSERT INTO career_test_results 
       (session_id, user_id, stream_scores, top_streams, confidence_level, 
        completion_percentage, recommended_colleges, career_suggestions, personalized_explanations)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       stream_scores = VALUES(stream_scores),
       top_streams = VALUES(top_streams),
       confidence_level = VALUES(confidence_level),
       completion_percentage = VALUES(completion_percentage),
       recommended_colleges = VALUES(recommended_colleges),
       career_suggestions = VALUES(career_suggestions),
       personalized_explanations = VALUES(personalized_explanations),
       calculated_at = CURRENT_TIMESTAMP`,
            [
                sessionId,
                userId,
                JSON.stringify(resultsData.streamScores),
                JSON.stringify(resultsData.topStreams),
                resultsData.confidenceLevel,
                resultsData.completionPercentage,
                JSON.stringify(resultsData.recommendedColleges),
                JSON.stringify(resultsData.careerSuggestions),
                JSON.stringify(resultsData.personalizedExplanations)
            ]
        );

        // Step 8: Mark session as completed
        await pool.query(
            `UPDATE career_test_sessions 
       SET status = 'completed', completion_time = CURRENT_TIMESTAMP 
       WHERE id = ?`,
            [sessionId]
        );

        // Step 9: Return results
        res.status(200).json({
            success: true,
            sessionId,
            results: resultsData
        });

    } catch (error) {
        console.error('Error finishing test:', error);
        res.status(500).json({ error: 'Failed to calculate results' });
    }
}

/**
 * GET TEST RESULTS
 * Retrieves calculated results for a session
 * 
 * @route GET /api/career-test/result/:sessionId
 */
export async function getTestResults(req, res) {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const pool = getPool();

        // Verify session belongs to user
        const [sessions] = await pool.query(
            `SELECT id FROM career_test_sessions 
       WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get results
        const [results] = await pool.query(
            `SELECT * FROM career_test_results WHERE session_id = ?`,
            [sessionId]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: 'Results not calculated yet' });
        }

        const result = results[0];

        // Parse JSON fields
        res.status(200).json({
            sessionId: result.session_id,
            streamScores: JSON.parse(result.stream_scores),
            topStreams: JSON.parse(result.top_streams),
            confidenceLevel: result.confidence_level,
            completionPercentage: parseFloat(result.completion_percentage),
            recommendedColleges: JSON.parse(result.recommended_colleges || '[]'),
            careerSuggestions: JSON.parse(result.career_suggestions || '[]'),
            calculatedAt: result.calculated_at
        });

    } catch (error) {
        console.error('Error getting results:', error);
        res.status(500).json({ error: 'Failed to retrieve results' });
    }
}

/**
 * GET COLLEGE SUGGESTIONS
 * Helper function to get relevant colleges based on streams
 * 
 * LOGIC (for VIVA):
 * - Filters colleges by stream type
 * - Prioritizes government colleges
 * - Returns top 10 matches per stream
 * 
 * @param {Array} streams - Array of stream names
 * @param {string} category - User category
 * @returns {Array} College suggestions
 */
async function getCollegeSuggestions(streams, category) {
    try {
        const pool = getPool();

        // Map stream names to college types
        const streamToType = {
            science: ['science', 'medical'],
            commerce: ['commerce'],
            technology: ['technology'],
            arts: ['arts'],
            design: ['design']
        };

        const collegeTypes = [];
        streams.forEach(stream => {
            if (streamToType[stream]) {
                collegeTypes.push(...streamToType[stream]);
            }
        });

        if (collegeTypes.length === 0) {
            return [];
        }

        // Build query with placeholders
        const placeholders = collegeTypes.map(() => '?').join(',');

        const [colleges] = await pool.query(
            `SELECT name, state, city, type, ownership
       FROM colleges
       WHERE type IN (${placeholders})
       ORDER BY 
         CASE ownership WHEN 'government' THEN 1 ELSE 2 END,
         RAND()
       LIMIT 10`,
            collegeTypes
        );

        return colleges;

    } catch (error) {
        console.error('Error getting college suggestions:', error);
        return [];
    }
}

/**
 * RESUME SESSION
 * Check if user has an in-progress session and return its details
 * 
 * @route GET /api/career-test/resume/:category
 */
export async function resumeSession(req, res) {
    try {
        const { category } = req.params;
        const userId = req.user.id;

        const pool = getPool();

        // Find most recent in-progress session for this category
        const [sessions] = await pool.query(
            `SELECT id, category, total_questions, answered_questions, start_time
       FROM career_test_sessions
       WHERE user_id = ? AND category = ? AND status = 'in_progress'
       ORDER BY start_time DESC
       LIMIT 1`,
            [userId, category]
        );

        if (sessions.length === 0) {
            return res.status(404).json({
                canResume: false,
                message: 'No in-progress session found'
            });
        }

        const session = sessions[0];

        // Get answered question IDs
        const [answers] = await pool.query(
            `SELECT question_id FROM career_test_answers WHERE session_id = ?`,
            [session.id]
        );

        const answeredQuestionIds = answers.map(a => a.question_id);

        res.status(200).json({
            canResume: true,
            sessionId: session.id,
            category: session.category,
            totalQuestions: session.total_questions,
            answeredQuestions: session.answered_questions,
            answeredQuestionIds,
            startTime: session.start_time
        });

    } catch (error) {
        console.error('Error checking resume session:', error);
        res.status(500).json({ error: 'Failed to check session' });
    }
}

/**
 * ABANDON SESSION
 * Marks a session as abandoned
 * 
 * @route POST /api/career-test/abandon
 * @body { sessionId }
 */
export async function abandonSession(req, res) {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        const pool = getPool();

        await pool.query(
            `UPDATE career_test_sessions 
       SET status = 'abandoned' 
       WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Session abandoned'
        });

    } catch (error) {
        console.error('Error abandoning session:', error);
        res.status(500).json({ error: 'Failed to abandon session' });
    }
}

/**
 * CHANGE USER STREAM
 * Resets user's stream selection to force common test on next attempt
 * 
 * FLOW (for VIVA):
 * 1. Verify user authentication
 * 2. Reset stream_status and selected_stream to NULL
 * 3. User will get common test on next session creation
 * 
 * @route POST /api/career-test/change-stream
 */
export async function changeUserStream(req, res) {
    try {
        const userId = req.user.id;
        const pool = getPool();

        // Reset user's stream selection
        await pool.query(
            `UPDATE users 
             SET stream_status = NULL, 
                 selected_stream = NULL,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [userId]
        );

        console.log(`Stream reset for user ${userId} - will take common test on next attempt`);

        res.status(200).json({
            success: true,
            message: 'Stream selection reset. You will now take the common aptitude test to discover your best stream.'
        });

    } catch (error) {
        console.error('Error changing user stream:', error);
        res.status(500).json({ error: 'Failed to reset stream selection' });
    }
}

/**
 * EXPORT ALL CONTROLLER FUNCTIONS
 */
export default {
    createTestSession,
    saveAnswer,
    finishTestAndCalculate,
    getTestResults,
    resumeSession,
    abandonSession,
    changeUserStream  // NEW: Export stream change function
};
