/**
 * SCORING ENGINE UTILITY
 * Advanced Multi-Category Career Assessment System
 * CS508 Minor Project I
 * 
 * Purpose: Calculate career stream scores from user answers
 * Features:
 * - Weighted scoring based on question difficulty
 * - Normalization for incomplete tests
 * - Confidence level calculation
 * - Top 3 stream recommendations
 */

/**
 * MAIN SCORING FUNCTION
 * Calculates stream scores from test answers
 * 
 * @param {Array} answers - Array of answer objects with question data
 * @param {number} totalQuestions - Total questions in category
 * @returns {Object} - Scoring results
 * 
 * ALGORITHM EXPLANATION (for VIVA):
 * 1. Initialize scores for all 5 streams to 0
 * 2. For each answer:
 *    - Get the selected option's score_mapping
 *    - Multiply each score by question weight
 *    - Add to corresponding stream's total
 * 3. Calculate max possible score (sum of all weights * 3)
 * 4. Normalize each stream: (actualScore / maxPossible) * 100
 * 5. If test incomplete, adjust confidence level
 * 6. Rank streams and select top 3
 */
export function calculateCareerScores(answers, totalQuestions) {
    // Step 1: Initialize stream scores
    const streamScores = {
        science: 0,
        commerce: 0,
        technology: 0,
        arts: 0,
        design: 0
    };

    // Step 2: Accumulate scores from answers
    let maxPossibleScore = 0;

    answers.forEach(answer => {
        const { question, selected_option_index } = answer;
        const selectedOption = question.options[selected_option_index];
        const weight = question.weight || 1.0;

        // Add each stream's score (weighted)
        Object.entries(selectedOption.score_mapping).forEach(([stream, score]) => {
            streamScores[stream] += score * weight;
        });

        // Calculate max possible for this question (max score is 3)
        maxPossibleScore += 3 * weight;
    });

    // Step 3: Normalize scores to percentages
    const percentageScores = {};
    Object.entries(streamScores).forEach(([stream, score]) => {
        if (maxPossibleScore > 0) {
            percentageScores[stream] = Math.round((score / maxPossibleScore) * 100);
        } else {
            percentageScores[stream] = 0;
        }
    });

    // Step 4: Calculate completion percentage
    const completionPercentage = (answers.length / totalQuestions) * 100;

    // Step 5: Determine confidence level
    const confidence = calculateConfidenceLevel(completionPercentage, answers.length);

    // Step 6: Get top 3 streams
    const topStreams = getTopStreams(percentageScores);

    // Step 7: Return results
    return {
        streamScores: percentageScores,
        rawScores: streamScores,
        topStreams,
        confidenceLevel: confidence,
        completionPercentage: Math.round(completionPercentage),
        totalAnswers: answers.length,
        totalQuestions
    };
}

/**
 * CONFIDENCE LEVEL CALCULATOR
 * Determines reliability of results based on completion
 * 
 * LOGIC (for VIVA):
 * - High: 80%+ completion with 20+ answers
 * - Medium: 50-79% completion or 10-19 answers
 * - Low: <50% completion or <10 answers
 * 
 * @param {number} completionPercentage - % of test completed
 * @param {number} answersCount - Number of questions answered
 * @returns {string} - 'low', 'medium', or 'high'
 */
export function calculateConfidenceLevel(completionPercentage, answersCount) {
    // High confidence: Most questions answered
    if (completionPercentage >= 80 && answersCount >= 20) {
        return 'high';
    }

    // Medium confidence: Decent number of answers
    if (completionPercentage >= 50 && answersCount >= 10) {
        return 'medium';
    }

    // Low confidence: Too few answers
    return 'low';
}

/**
 * TOP STREAMS SELECTOR
 * Ranks streams and selects top 3 recommendations
 * 
 * @param {Object} percentageScores - Stream scores as percentages
 * @returns {Array} - Top 3 streams with ranks
 * 
 * FORMAT (for VIVA):
 * [
 *   { stream: 'science', score: 85, rank: 1 },
 *   { stream: 'technology', score: 78, rank: 2 },
 *   { stream: 'design', score: 50, rank: 3 }
 * ]
 */
export function getTopStreams(percentageScores) {
    // Convert to array and sort by score (descending)
    const sorted = Object.entries(percentageScores)
        .map(([stream, score]) => ({ stream, score }))
        .sort((a, b) => b.score - a.score);

    // Take top 3 and add rank
    return sorted.slice(0, 3).map((item, index) => ({
        ...item,
        rank: index + 1
    }));
}

/**
 * STREAM INFO MAPPING
 * Provides detailed information about each career stream
 * Used for recommendations and explanations
 */
export const streamDetails = {
    science: {
        name: 'Science',
        description: 'Research, Medicine, Engineering, and Scientific Innovation',
        careers: ['Doctor', 'Scientist', 'Researcher', 'Engineer', 'Biotechnologist'],
        skills: ['Analytical Thinking', 'Problem Solving', 'Research', 'Attention to Detail'],
        education: ['B.Sc', 'MBBS', 'B.Tech', 'M.Sc', 'PhD'],
        color: '#3b82f6'
    },
    commerce: {
        name: 'Commerce',
        description: 'Business, Finance, Accounting, and Economics',
        careers: ['CA', 'Banker', 'Financial Analyst', 'Business Manager', 'Economist'],
        skills: ['Financial Analysis', 'Business Acumen', 'Planning', 'Decision Making'],
        education: ['B.Com', 'BBA', 'CA', 'MBA', 'CFA'],
        color: '#f59e0b'
    },
    technology: {
        name: 'Technology',
        description: 'Software, AI, Data Science, and Information Technology',
        careers: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Cloud Architect'],
        skills: ['Programming', 'Logical Thinking', 'Innovation', 'Technical Skills'],
        education: ['B.Tech CSE', 'B.Sc IT', 'MCA', 'M.Tech', 'Certifications'],
        color: '#10b981'
    },
    arts: {
        name: 'Arts',
        description: 'Literature, History, Social Sciences, and Humanities',
        careers: ['Writer', 'Journalist', 'Historian', 'Psychologist', 'Lawyer'],
        skills: ['Communication', 'Critical Thinking', 'Creativity', 'Empathy'],
        education: ['BA', 'MA', 'LLB', 'Journalism', 'Psychology'],
        color: '#ec4899'
    },
    design: {
        name: 'Design',
        description: 'Creative Design, Architecture, and Visual Arts',
        careers: ['Graphic Designer', 'UX Designer', 'Architect', 'Fashion Designer'],
        skills: ['Creativity', 'Visual Thinking', 'Innovation', 'Aesthetic Sense'],
        education: ['B.Des', 'B.Arch', 'BFA', 'Fashion Design', 'Interior Design'],
        color: '#8b5cf6'
    }
};

/**
 * GENERATE CAREER SUGGESTIONS
 * Creates personalized career recommendations based on top streams
 * 
 * @param {Array} topStreams - Top 3 recommended streams
 * @param {string} category - User category (school/college/professional)
 * @returns {Array} - Career suggestions
 */
export function generateCareerSuggestions(topStreams, category) {
    const suggestions = [];

    topStreams.forEach((streamData, index) => {
        const stream = streamDetails[streamData.stream];

        // Select careers based on user category
        let careers = stream.careers;
        if (category === 'school') {
            careers = stream.careers.slice(0, 2); // Show  2 careers for school students
        } else if (category === 'college') {
            careers = stream.careers.slice(0, 3); // Show 3 careers for college students
        }

        suggestions.push({
            stream: streamData.stream,
            streamName: stream.name,
            rank: index + 1,
            score: streamData.score,
            description: stream.description,
            careers: careers,
            skills: stream.skills,
            education: stream.education,
            color: stream.color
        });
    });

    return suggestions;
}

/**
 * GENERATE PERSONALIZED EXPLANATION
 * Creates "Why this suits you" explanation based on answers
 * 
 * @param {Array} topStreams - Top recommended streams
 * @param {Array} answers - User's answers
 * @param {string} category - User category
 * @returns {Object} - Personalized explanations for top 2 streams
 */
export function generatePersonalizedExplanation(topStreams, answers, category) {
    const explanations = {};

    // Analyze answer patterns
    const analysis = analyzeAnswerPatterns(answers);

    // Generate explanation for best-fit stream
    const bestFit = topStreams[0];
    const secondBest = topStreams[1];

    explanations.bestFit = {
        stream: bestFit.stream,
        streamName: streamDetails[bestFit.stream].name,
        score: bestFit.score,
        whyThisSuitsYou: generateWhyMessage(bestFit.stream, analysis, category),
        recommendedFields: streamDetails[bestFit.stream].careers,
        keyStrengths: identifyKeyStrengths(bestFit.stream, analysis),
        nextSteps: generateNextSteps(bestFit.stream, category)
    };

    // Generate for second-best stream
    if (secondBest) {
        explanations.secondBest = {
            stream: secondBest.stream,
            streamName: streamDetails[secondBest.stream].name,
            score: secondBest.score,
            whyConsider: `Your ${secondBest.score}% compatibility with ${streamDetails[secondBest.stream].name} suggests you also have strong potential in this area.`,
            alternativeFields: streamDetails[secondBest.stream].careers.slice(0, 3)
        };
    }

    return explanations;
}

/**
 * ANALYZE ANSWER PATTERNS
 * Identifies patterns in user's answers
 */
function analyzeAnswerPatterns(answers) {
    const patterns = {
        interests: [],
        strengths: [],
        workStyle: []
    };

    answers.forEach(answer => {
        const questionType = answer.question.type;
        const selectedOption = answer.question.options[answer.selected_option_index];

        if (questionType === 'interest') {
            patterns.interests.push(selectedOption.text);
        } else if (questionType === 'aptitude') {
            patterns.strengths.push(selectedOption.text);
        } else if (questionType === 'work_style') {
            patterns.workStyle.push(selectedOption.text);
        }
    });

    return patterns;
}

/**
 * GENERATE "WHY THIS SUITS YOU" MESSAGE
 */
function generateWhyMessage(stream, analysis, category) {
    const streamInfo = streamDetails[stream];
    const messages = {
        science: `Your analytical mindset and interest in understanding how things work makes Science an excellent fit. You've shown strong problem-solving abilities and curiosity about natural phenomena, which are essential for success in scientific fields.`,
        commerce: `Your business acumen and interest in financial planning indicate a natural fit for Commerce. You demonstrate strong organizational skills and an understanding of economic concepts, which are crucial for business and finance careers.`,
        technology: `Your logical thinking and interest in innovation make Technology your ideal path. You've shown aptitude for problem-solving and creating solutions, essential skills for success in the tech industry.`,
        arts: `Your creative expression and communication skills align perfectly with Arts. You demonstrate strong empathy, critical thinking, and the ability to understand complex social dynamics, which are vital for humanities careers.`,
        design: `Your creative vision and aesthetic sense make Design your perfect match. You've shown strong visual thinking and innovation capabilities, essential for success in creative industries.`
    };

    return messages[stream] || `Your interests and abilities align well with ${streamInfo.name}.`;
}

/**
 * IDENTIFY KEY STRENGTHS
 */
function identifyKeyStrengths(stream, analysis) {
    const strengthMap = {
        science: ['Analytical thinking', 'Research skills', 'Attention to detail', 'Problem-solving'],
        commerce: ['Financial analysis', 'Business planning', 'Decision making', 'Leadership'],
        technology: ['Logical reasoning', 'Innovation', 'Technical skills', 'Systematic approach'],
        arts: ['Communication', 'Critical thinking', 'Empathy', 'Cultural awareness'],
        design: ['Creativity', 'Visual thinking', 'Innovation', 'Aesthetic sense']
    };

    return strengthMap[stream] || [];
}

/**
 * GENERATE NEXT STEPS
 */
function generateNextSteps(stream, category) {
    if (category === 'school') {
        const stepsMap = {
            science: ['Focus on Physics, Chemistry, Biology, Maths', 'Participate in science fairs', 'Consider PCM or PCB in 11th/12th'],
            commerce: ['Strengthen Maths and Economics', 'Learn basics of accounting', 'Follow business news'],
            technology: ['Learn programming basics', 'Participate in coding competitions', 'Take up Computer Science'],
            arts: ['Read extensively', 'Join debate or drama clubs', 'Improve writing skills'],
            design: ['Practice sketching daily', 'Learn design software', 'Build a portfolio']
        };
        return stepsMap[stream] || [];
    }

    return [];
}

/**
 * VALIDATE ANSWER DATA
 * Ensures answer data is properly formatted
 * 
 * @param {Object} answer - Answer object
 * @returns {boolean} - Is valid
 */
export function validateAnswer(answer) {
    if (!answer) return false;
    if (!answer.question) return false;
    if (typeof answer.selected_option_index !== 'number') return false;
    if (answer.selected_option_index < 0 || answer.selected_option_index > 3) return false;
    if (!answer.question.options) return false;
    if (!answer.question.options[answer.selected_option_index]) return false;
    if (!answer.question.options[answer.selected_option_index].score_mapping) return false;

    return true;
}

/**
 * NORMALIZE PARTIAL TEST RESULTS
 * Adjusts scores when test is incomplete
 * Uses weighted average approach
 * 
 * @param {Object} scores - Raw stream scores
 * @param {number} answeredQuestions - Questions answered
 * @param {number} totalQuestions - Total questions
 * @returns {Object} - Normalized scores
 */
export function normalizePartialResults(scores, answeredQuestions, totalQuestions) {
    const completionRatio = answeredQuestions / totalQuestions;
    const adjustmentFactor = Math.sqrt(completionRatio); // Square root for smoother adjustment

    const normalized = {};
    Object.entries(scores).forEach(([stream, score]) => {
        normalized[stream] = Math.round(score * adjustmentFactor);
    });

    return normalized;
}

/**
 * EXPORT DEFAULT SCORING FUNCTION
 * Main export for use in controllers
 */
export default {
    calculateCareerScores,
    calculateConfidenceLevel,
    getTopStreams,
    generateCareerSuggestions,
    generatePersonalizedExplanation,
    validateAnswer,
    normalizePartialResults,
    streamDetails
};
