/**
 * ADVANCED CAREER APTITUDE TEST - COMPLETE REPLACEMENT
 * Database-driven multi-category career assessment system
 * CS508 Minor Project I
 * 
 * Features:
 * - 3 user categories (school/college/professional)
 * - Database-backed questions
 * - Pause/resume functionality
 * - API-based scoring
 * - Confidence levels
 * - College recommendations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CareerCategorySelector from './CareerCategorySelector';
import TestProgress from './TestProgress';
import AptitudeResults from './AptitudeResults';
import * as careerTestApi from '../utils/careerTestApi';

const AptitudeTest = () => {
  // Test flow states
  const [currentScreen, setCurrentScreen] = useState('category'); // 'category' | 'test' | 'results'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Test session data
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Results
  const [results, setResults] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null); // For college dynamic flow
  const [filteredQuestions, setFilteredQuestions] = useState([]); // Dynamically filtered questions

  /**
   * FILTER COLLEGE QUESTIONS BASED ON STREAM SELECTION
   * For college category: Show Q1, then Q2-Q4 (common), then stream-specific Q5-Q8, then Q9-Q10
   */
  const filterCollegeQuestions = (allQuestions, streamSelection) => {
    console.log('🔍 Filtering questions. Stream selection:', streamSelection);
    console.log('📚 Total questions available:', allQuestions.length);

    if (streamSelection === null || streamSelection === undefined) {
      // Show only Q1 (stream selection) initially
      const initial = allQuestions.filter(q => q.id === 101);
      console.log('✅ Initial load: Showing only Q1', initial);
      return initial;
    }

    const streamMap = {
      0: 'engineering',
      1: 'medical',
      2: 'commerce',
      3: 'arts',
      4: 'design'
    };

    const selectedStreamFilter = streamMap[streamSelection];
    console.log('🎯 Selected stream filter:', selectedStreamFilter);

    // Get all questions to show after stream selection
    const filtered = allQuestions.filter(q => {
      // Always include Q1 (already answered)
      if (q.id === 101) return true;

      // Always include common questions (Q2-Q4 = ids 102-104, Q9-Q10 = ids 125-126)
      if (q.section === 'common') return true;

      // Include stream-specific questions matching selected stream
      if (q.stream_filter === selectedStreamFilter) return true;

      return false;
    });

    // Sort to ensure proper order: Q1, Q2-Q4, stream-specific, Q9-Q10
    const sorted = filtered.sort((a, b) => a.id - b.id);

    console.log('✅ Filtered questions:', sorted.length);
    console.log('📋 Question IDs:', sorted.map(q => q.id));

    return sorted;
  };

  /**
   * HANDLE CATEGORY SELECTION
   * Starts a new test session for selected category
   */
  const handleCategorySelect = async (category) => {
    setLoading(true);
    setError(null);

    try {
      // Call API to create session and get questions
      const response = await careerTestApi.startCareerTest(category);

      console.log('📦 Backend Response:', response);
      console.log('📋 Questions received:', response.questions);
      console.log('🔑 First question structure:', response.questions[0]);

      setSelectedCategory(category);
      setSessionId(response.sessionId);

      // For college category, initialize with only Q1
      if (category === 'college') {
        const initialQuestions = filterCollegeQuestions(response.questions, null);
        setQuestions(response.questions); // Store all questions
        setFilteredQuestions(initialQuestions); // Show only Q1 initially
      } else {
        setQuestions(response.questions);
        setFilteredQuestions(response.questions);
      }

      setCurrentScreen('test');
      setQuestionStartTime(Date.now());

    } catch (err) {
      setError(err.message || 'Failed to start test. Please try again.');
      console.error('Error starting test:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE ANSWER SELECTION
   * Saves answer and moves to next question
   */
  const handleAnswer = async (optionIndex) => {
    if (isPaused) return;

    const currentQuestion = filteredQuestions[currentQuestionIndex] || questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    // Save to local state
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        optionIndex,
        timeSpent
      }
    });

    // For college category: If Q1 (stream selection) was just answered, filter remaining questions
    if (selectedCategory === 'college' && currentQuestion.id === 101) {
      setSelectedStream(optionIndex);
      const newFilteredQuestions = filterCollegeQuestions(questions, optionIndex);
      setFilteredQuestions(newFilteredQuestions);

      // CRITICAL: Move to next question (Q2) after filtering
      // Don't finish test - we just started!
      setCurrentQuestionIndex(1); // Move to index 1 (which is Q2 in filtered array)
      setQuestionStartTime(Date.now());

      // Save to backend
      try {
        await careerTestApi.saveAnswer(
          sessionId,
          currentQuestion.id,
          optionIndex,
          timeSpent
        );
      } catch (err) {
        console.error('Error saving answer:', err);
      }

      return; // Exit early - don't run the normal progression logic
    }

    // Save to backend (don't wait for response)
    try {
      await careerTestApi.saveAnswer(
        sessionId,
        currentQuestion.id,
        optionIndex,
        timeSpent
      );
    } catch (err) {
      console.error('Error saving answer:', err);
      // Continue anyway - we have it in local state
    }

    // Check if this is the last question
    const questionsToUse = selectedCategory === 'college' ? filteredQuestions : questions;
    if (currentQuestionIndex >= questionsToUse.length - 1) {
      // Last question - finish test
      await finishTest();
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    }
  };

  /**
   * FINISH TEST
   * Calls API to calculate results
   */
  const finishTest = async () => {
    setLoading(true);

    try {
      const response = await careerTestApi.finishTest(sessionId);
      setResults(response.results);
      setCurrentScreen('results');
    } catch (err) {
      setError('Failed to calculate results. Please try again.');
      console.error('Error finishing test:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE PAUSE/RESUME
   */
  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  /**
   * HANDLE SAVE & EXIT
   * Saves progress and exits to home
   */
  const handleSaveAndExit = async () => {
    if (window.confirm('Your progress will be saved. You can resume later from your profile.')) {
      // Progress is already saved via API
      window.location.href = '/user'; // Navigate to dashboard
    }
  };

  /**
   * HANDLE RESTART
   * Resets all states and goes back to category selection
   */
  const handleRestart = () => {
    setCurrentScreen('category');
    setSelectedCategory(null);
    setSessionId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setError(null);
    setIsPaused(false);
  };

  /**
   * HANDLE PREVIOUS QUESTION
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isPaused) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(Date.now());
    }
  };

  // =====================================================
  // RENDER: CATEGORY SELECTION SCREEN
  // =====================================================

  if (currentScreen === 'category') {
    return (
      <CareerCategorySelector
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  // =====================================================
  // RENDER: LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            {currentScreen === 'category' ? 'Starting your test...' : 'Calculating your results...'}
          </p>
        </motion.div>
      </div>
    );
  }

  // =====================================================
  // RENDER: RESULTS SCREEN
  // =====================================================

  if (currentScreen === 'results' && results) {
    return (
      <AptitudeResults
        results={results}
        onRestart={handleRestart}
        category={selectedCategory}
        isAdvancedTest={true}
      />
    );
  }

  // =====================================================
  // RENDER: TEST SCREEN
  // =====================================================

  if (currentScreen === 'test' && (questions.length > 0 || filteredQuestions.length > 0)) {
    // Use filtered questions for college, regular questions for others
    const questionsToDisplay = selectedCategory === 'college' && filteredQuestions.length > 0
      ? filteredQuestions
      : questions;

    const currentQuestion = questionsToDisplay[currentQuestionIndex];

    // Safety check - if no currentQuestion, show error
    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ No Questions Available</h2>
            <p className="text-gray-600 mb-4">
              There are no questions loaded for this category. This might be a database issue.
            </p>
            <button
              onClick={() => setCurrentScreen('category')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              ← Back to Categories
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'school' && '🎓 School Student Assessment'}
              {selectedCategory === 'college' && '🎯 College Student Assessment'}
              {selectedCategory === 'professional' && '💼 Professional Assessment'}
            </h1>
          </div>

          {/* Progress Bar */}
          <TestProgress
            current={currentQuestionIndex + 1}
            total={questionsToDisplay.length}
            onPause={handlePause}
            onExit={handleSaveAndExit}
            isPaused={isPaused}
          />

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Question Card */}
          {!isPaused && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                {/* Question Type Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)} Question
                  </span>
                  {currentQuestion.difficulty && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ml-2 ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQuestion.text}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id]?.optionIndex === option.index;

                    return (
                      <motion.button
                        key={option.index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.index)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Radio Button */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                            }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>

                          {/* Option Text */}
                          <span className="font-medium flex-1">{option.text}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>


                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    ← Previous
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {Object.keys(answers).length} / {questionsToDisplay.length} answered
                    </div>

                    {/* Submit Test Button - User can submit anytime */}
                    {Object.keys(answers).length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={finishTest}
                        className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300"
                      >
                        🎯 Submit Test
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER: ERROR/FALLBACK STATE
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error || 'Please try again'}</p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default AptitudeTest;