/**
 * CAREER ASSESSMENT API ROUTES
 * RESTful endpoints for advanced career assessment system
 * CS508 Minor Project I
 * 
 * All routes require JWT authentication
 * Base path: /api/career-test
 */

import express from 'express';
import careerController from '../controllers/careerAssessmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/career-test/start
 * @desc    Create new test session
 * @access  Protected (requires JWT)
 * @body    { category: 'school'|'college'|'professional' }
 * @returns { sessionId, category, totalQuestions, questions[] }
 */
router.post('/start', authMiddleware, careerController.createTestSession);

/**
 * @route   POST /api/career-test/answer
 * @desc    Save user's answer for a question
 * @access  Protected (requires JWT)
 * @body    { sessionId, questionId, optionIndex, timeSpent? }
 * @returns { success: true }
 */
router.post('/answer', authMiddleware, careerController.saveAnswer);

/**
 * @route   POST /api/career-test/finish
 * @desc    Complete test and calculate results
 * @access  Protected (requires JWT)
 * @body    { sessionId }
 * @returns { sessionId, results: { streamScores, topStreams, etc } }
 */
router.post('/finish', authMiddleware, careerController.finishTestAndCalculate);

/**
 * @route   GET /api/career-test/result/:sessionId
 * @desc    Get calculated results for a session
 * @access  Protected (requires JWT)
 * @params  sessionId
 * @returns Complete results object
 */
router.get('/result/:sessionId', authMiddleware, careerController.getTestResults);

/**
 * @route   GET /api/career-test/resume/:category
 * @desc    Check if user has an in-progress session to resume
 * @access  Protected (requires JWT)
 * @params  category
 * @returns { canResume: boolean, sessionId?, answeredQuestionIds? }
 */
router.get('/resume/:category', authMiddleware, careerController.resumeSession);

/**
 * @route   POST /api/career-test/abandon
 * @desc    Mark session as abandoned
 * @access  Protected (requires JWT)
 * @body    { sessionId }
 * @returns { success: true }
 */
/**
 * @route   POST /api/career-test/change-stream
 * @desc    Reset user's stream selection and force common test
 * @access  Protected (requires JWT)
 * @returns { success: true, message }
 */
router.post('/change-stream', authMiddleware, careerController.changeUserStream);

export default router;

