/**
 * TEST PROGRESS COMPONENT
 * Enhanced progress tracker with pause/resume functionality
 * CS508 Minor Project I - Advanced Career Assessment
 */

import React from 'react';
import { motion } from 'motion/react';

/**
 * Component Props:
 * @param {number} current - Current question number (1-indexed)
 * @param {number} total - Total number of questions
 * @param {Function} onPause - Callback to pause test
 * @param {Function} onExit - Callback to exit test
 * @param {boolean} isPaused - Is test currently paused
 */
const TestProgress = ({ current, total, onPause, onExit, isPaused }) => {

    const percentage = (current / total) * 100;
    const isComplete = current === total;

    return (
        <div className="mb-6">
            {/* Progress Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">
                        Question {current} of {total}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        {Math.round(percentage)}% Complete
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    {/* Pause/Resume Button */}
                    {onPause && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onPause}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPaused
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                        >
                            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                        </motion.button>
                    )}

                    {/* Save & Exit Button */}
                    {onExit && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onExit}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            💾 Save & Exit
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isComplete
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Shimmer Effect */}
                {!isComplete && (
                    <motion.div
                        className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: 'linear'
                        }}
                    />
                )}
            </div>

            {/* Milestone Indicators */}
            <div className="flex justify-between mt-2">
                {[25, 50, 75, 100].map((milestone) => {
                    const isPassed = percentage >= milestone;
                    return (
                        <div key={milestone} className="flex flex-col items-center">
                            <div
                                className={`w-2 h-2 rounded-full transition-colors ${isPassed ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                            />
                            <span className={`text-xs mt-1 ${isPassed ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                                {milestone}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Pause Overlay Message */}
            {isPaused && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">⏸️</span>
                        <div>
                            <p className="font-semibold text-yellow-800">Test Paused</p>
                            <p className="text-sm text-yellow-700">
                                Your progress is saved. Click Resume to continue.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TestProgress;
