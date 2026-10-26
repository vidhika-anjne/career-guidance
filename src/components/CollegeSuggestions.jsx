/**
 * COLLEGE SUGGESTIONS COMPONENT
 * Displays recommended colleges based on top career streams
 * CS508 Minor Project I - Advanced Career Assessment
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import PathConstants from '../routes/PathConstants';

/**
 * Component Props:
 * @param {Array} colleges - Array of college objects
 * @param {Array} topStreams - Top 3 recommended streams
 */
const CollegeSuggestions = ({ colleges, topStreams }) => {

    if (!colleges || colleges.length === 0) {
        return null;
    }

    // Stream colors for visual distinction
    const streamColors = {
        science: 'bg-blue-100 text-blue-800 border-blue-300',
        commerce: 'bg-orange-100 text-orange-800 border-orange-300',
        technology: 'bg-green-100 text-green-800 border-green-300',
        arts: 'bg-pink-100 text-pink-800 border-pink-300',
        design: 'bg-purple-100 text-purple-800 border-purple-300'
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        🏫 Recommended Colleges
                    </h3>
                    <p className="text-gray-600">
                        Colleges matching your top career streams
                    </p>
                </div>
                <Link
                    to={PathConstants.SEARCH}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                    Explore More →
                </Link>
            </div>

            {/* Top Streams Legend */}
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Your Top Streams:</span>
                {topStreams && topStreams.map((stream, idx) => (
                    <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${streamColors[stream.stream] || 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        #{idx + 1} {stream.stream.charAt(0).toUpperCase() + stream.stream.slice(1)} ({stream.score}%)
                    </span>
                ))}
            </div>

            {/* College Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colleges.map((college, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                        {/* College Name */}
                        <h4 className="font-bold text-gray-800 mb-2 text-lg">
                            {college.name}
                        </h4>

                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span className="mr-2">📍</span>
                            <span>{college.city}, {college.state}</span>
                        </div>

                        {/* Type and Ownership */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${streamColors[college.type] || 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}>
                                {college.type}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${college.ownership === 'government'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                {college.ownership === 'government' ? '🏛️ Govt.' : '🏢 Private'}
                            </span>
                        </div>

                        {/* Learn More Link */}
                        <Link
                            to={PathConstants.SEARCH}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                        >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* No Results Message */}
            {colleges.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No college recommendations available</p>
                    <p className="text-sm mt-2">Try exploring the college search page</p>
                </div>
            )}

            {/* CTA */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">💡</span>
                        <div>
                            <p className="font-semibold text-blue-800">Want More Options?</p>
                            <p className="text-sm text-blue-700">
                                Explore our complete college database with advanced filters
                            </p>
                        </div>
                    </div>
                    <Link
                        to={PathConstants.SEARCH}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    >
                        Search Colleges
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CollegeSuggestions;
