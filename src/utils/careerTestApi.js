/**
 * CAREER TEST API UTILITY
 * Frontend API calls for advanced career assessment
 * CS508 Minor Project I
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

/**
 * START TEST SESSION
 * Creates a new test session for selected category
 * 
 * @param {string} category - 'school', 'college', or 'professional'
 * @returns {Promise} Response with sessionId and questions
 */
export async function startCareerTest(category) {
    const response = await fetch(`${API_BASE}/api/career-test/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for JWT
        body: JSON.stringify({ category })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start test');
    }

    return await response.json();
}

/**
 * SAVE ANSWER
 * Saves user's answer for a specific question
 * 
 * @param {number} sessionId - Test session ID
 * @param {number} questionId - Question ID
 * @param {number} optionIndex - Selected option index (0-3)
 * @param {number} timeSpent - Time spent on question in seconds
 * @returns {Promise} Success response
 */
export async function saveAnswer(sessionId, questionId, optionIndex, timeSpent = null) {
    const response = await fetch(`${API_BASE}/api/career-test/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            sessionId,
            questionId,
            optionIndex,
            timeSpent
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save answer');
    }

    return await response.json();
}

/**
 * FINISH TEST
 * Completes test and calculates results
 * 
 * @param {number} sessionId - Test session ID
 * @returns {Promise} Response with calculated results
 */
export async function finishTest(sessionId) {
    const response = await fetch(`${API_BASE}/api/career-test/finish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to finish test');
    }

    return await response.json();
}

/**
 * GET TEST RESULTS
 * Retrieves results for a completed test session
 * 
 * @param {number} sessionId - Test session ID
 * @returns {Promise} Test results
 */
export async function getTestResults(sessionId) {
    const response = await fetch(`${API_BASE}/api/career-test/result/${sessionId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get results');
    }

    return await response.json();
}

/**
 * CHECK RESUME SESSION
 * Checks if user has an in-progress session to resume
 * 
 * @param {string} category - Category to check
 * @returns {Promise} Resume info or null
 */
export async function checkResumeSession(category) {
    const response = await fetch(`${API_BASE}/api/career-test/resume/${category}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        return { canResume: false };
    }

    return await response.json();
}

/**
 * ABANDON SESSION
 * Marks a session as abandoned
 * 
 * @param {number} sessionId - Session ID to abandon
 * @returns {Promise} Success response
 */
export async function abandonSession(sessionId) {
    const response = await fetch(`${API_BASE}/api/career-test/abandon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to abandon session');
    }

    return await response.json();
}

/**
 * Export all API functions
 */
export default {
    startCareerTest,
    saveAnswer,
    finishTest,
    getTestResults,
    checkResumeSession,
    abandonSession
};
