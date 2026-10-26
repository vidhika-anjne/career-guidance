/**
 * Aptitude Test Service
 * Handles conditional test logic based on user's stream selection
 * Maintains backward compatibility for existing users
 */

import { getStreamQuestions, hasStreamQuestions } from '../data/streamQuestions.js';
import { getPool } from '../db/pool.js';

/**
 * Determine which type of test to show user
 * @param {Object} user - User object with stream information
 * @returns {string} 'common' or 'stream-specific'
 */
export function determineTestType(user) {
    // BACKWARD COMPATIBILITY: Existing users with no stream info get common test
    if (!user || !user.stream_status || user.stream_status !== 'Selected') {
        return 'common';
    }

    // User selected stream but  no valid stream value
    if (!user.selected_stream || user.selected_stream.trim() === '') {
        return 'common';
    }

    // Check if we have stream-specific questions available
    if (!hasStreamQuestions(user.selected_stream)) {
        console.warn(`Stream ${user.selected_stream} has insufficient questions, using common test`);
        return 'common';
    }

    return 'stream-specific';
}

/**
 * Get applicable questions for user based on their stream status
 * @param {Object} user - User object
 * @param {Array} commonQuestions - Common aptitude questions (existing)
 * @returns {Array} Questions to show
 */
export function getApplicableQuestions(user, commonQuestions) {
    const testType = determineTestType(user);

    if (testType === 'common') {
        // Return existing common questions (NO CHANGES to existing behavior)
        return commonQuestions;
    }

    // Return stream-specific questions
    const streamQuestions = getStreamQuestions(user.selected_stream);

    if (!streamQuestions || streamQuestions.length === 0) {
        console.warn(`Failed to load stream questions, falling back to common test`);
        return commonQuestions;
    }

    return streamQuestions;
}

/**
 * Reset user's stream selection (for "Change Stream" feature)
 * Forces user to take common test on next attempt
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export async function resetUserStream(userId) {
    const pool = getPool();

    try {
        await pool.query(
            `UPDATE users 
       SET stream_status = NULL, 
           selected_stream = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
            [userId]
        );

        console.log(`Stream reset for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Error resetting user stream:', error);
        return false;
    }
}

/**
 * Update user's stream after completing common test
 * @param {number} userId - User ID
 * @param {string} recommendedStream - Stream recommended from test results
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserStream(userId, recommendedStream) {
    const pool = getPool();

    try {
        await pool.query(
            `UPDATE users 
       SET selected_stream = ?,
           stream_status = 'Selected',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
            [recommendedStream, userId]
        );

        console.log(`Stream updated to ${recommendedStream} for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Error updating user stream:', error);
        return false;
    }
}

/**
 * Get user's stream information
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Stream info object
 */
export async function getUserStreamInfo(userId) {
    const pool = getPool();

    try {
        const [rows] = await pool.query(
            `SELECT education_level, class_or_year, stream_status, selected_stream
       FROM users 
       WHERE id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error('Error fetching user stream info:', error);
        return null;
    }
}

/**
 * Validate stream selection
 * @param {string} stream - Stream name
 * @returns {boolean} Is valid
 */
export function isValidStream(stream) {
    const validStreams = ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Management'];
    return validStreams.includes(stream);
}

/**
 * Validate education level and class
 * @param {string} educationLevel - School or College
 * @param {string} classOrYear - Class/Year value
 * @returns {boolean} Is valid
 */
export function isValidEducationInfo(educationLevel, classOrYear) {
    if (!educationLevel) return true; // Optional field

    const validSchoolClasses = ['9', '10', '11', '12'];
    const validCollegeYears = ['UG Year 1', 'UG Year 2', 'UG Year 3', 'UG Year 4', 'PG Year 1', 'PG Year 2'];

    if (educationLevel === 'School') {
        return !classOrYear || validSchoolClasses.includes(classOrYear);
    }

    if (educationLevel === 'College') {
        return !classOrYear || validCollegeYears.includes(classOrYear);
    }

    return false;
}
