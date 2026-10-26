/**
 * CAREER CATEGORY SELECTOR COMPONENT
 * Allows users to choose their category before taking the test
 * CS508 Minor Project I - Advanced Career Assessment
 * 
 * Categories:
 * - School Student (Class 8-12)
 * - College Student
 */

import React from 'react';
import { motion } from 'motion/react';

/**
 * Component Props:
 * @param {Function} onSelectCategory - Callback when category is selected
 * @param {Function} onBack - Callback to go back
 */
const CareerCategorySelector = ({ onSelectCategory, onBack }) => {

    // Category data with descriptions and icons
    const categories = [
        {
            id: 'school',
            title: 'School Student',
            subtitle: 'Class 8-12',
            icon: '🎓',
            description: 'Discover your ideal stream after 10th or 12th grade',
            color: 'from-blue-500 to-cyan-500',
            recommended: '14-18 years old',
            features: ['Stream selection', 'Career exploration', 'College planning']
        },
        {
            id: 'college',
            title: 'College Student',
            subtitle: 'Undergraduate/Graduate',
            icon: '🎯',
            description: 'Find specializations and internship paths aligned with your goals',
            color: 'from-purple-500 to-pink-500',
            recommended: '18-25 years old',
            features: ['Specialization guidance', 'Internship paths', 'Skill development']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto w-full"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <span className="text-4xl">🎯</span>
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Choose Your Category
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Select the category that best describes you for personalized assessment
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300">
                                {/* Icon and Title */}
                                <div className="text-center mb-4">
                                    <div className="text-6xl mb-3">{category.icon}</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {category.subtitle}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-center mb-4 flex-grow">
                                    {category.description}
                                </p>

                                {/* Recommended Age */}
                                <div className="bg-gray-50 rounded-lg p-2 mb-4">
                                    <p className="text-xs text-gray-500 text-center">
                                        Recommended for: <span className="font-semibold">{category.recommended}</span>
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    {category.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-600 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Select Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onSelectCategory(category.id)}
                                    className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${category.color} shadow-lg hover:shadow-xl transition-all duration-300`}
                                >
                                    Select This Category
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-start">
                        <div className="text-3xl mr-4">💡</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-2">What to Expect:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="mr-2">🎯</span>
                                    <span>Category-specific questions</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">⏱️</span>
                                    <span>10-15 minutes completion time</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">💾</span>
                                    <span>Pause & resume anytime</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">📊</span>
                                    <span>Detailed results with confidence levels</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">🏫</span>
                                    <span>College recommendations</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">🎓</span>
                                    <span>Career path suggestions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                {onBack && (
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBack}
                            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
                        >
                            ← Back to Quick Test
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CareerCategorySelector;
