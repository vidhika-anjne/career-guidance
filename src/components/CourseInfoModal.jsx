import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { courseDatabase } from "../data/courseDatabase";

const CourseInfoModal = ({ isOpen, onClose, courseName }) => {
    if (!isOpen || !courseName) return null;

    // Smart course name parsing
    let courseInfo = courseDatabase[courseName];
    let displayName = courseName;

    // If not found, try parsing compound names and variations
    if (!courseInfo) {
        // Remove trailing period first (B.Sc. → B.Sc)
        let cleanedName = courseName.trim().replace(/\.+$/, '');
        courseInfo = courseDatabase[cleanedName];
        displayName = cleanedName;

        if (!courseInfo) {
            // Try parsing special patterns
            if (courseName.includes('/')) {
                const firstPart = courseName.split('/')[0].trim().replace(/\.+$/, '');
                courseInfo = courseDatabase[firstPart];
                displayName = firstPart;
            } else if (courseName.includes(',')) {
                const firstPart = courseName.split(',')[0].trim().replace(/\.+$/, '');
                courseInfo = courseDatabase[firstPart];
                displayName = firstPart;
            } else if (courseName.includes('+')) {
                const firstPart = courseName.split('+')[0].trim().replace(/\.+$/, '');
                courseInfo = courseDatabase[firstPart];
                displayName = firstPart;
            } else if (courseName.includes('(')) {
                const baseName = courseName.split('(')[0].trim().replace(/\.+$/, '');
                courseInfo = courseDatabase[baseName];
                displayName = baseName;
            } else if (courseName.includes(' ')) {
                const firstWord = courseName.split(' ')[0].trim().replace(/\.+$/, '');
                courseInfo = courseDatabase[firstWord];
                displayName = firstWord;
            }
        }
    }

    // Generate helpful information for non-course stages
    const getGenericInfo = (stageName) => {
        // Check if it's a foundation stage (12th)
        if (stageName.includes('PCB') || stageName.includes('PCM') || stageName.includes('12th') || stageName.includes('Commerce') || stageName.includes('Any Stream')) {
            return {
                title: "Foundation Stage",
                description: `This is the foundation stage where you complete your ${stageName}. This prepares you for entrance exams and higher education.`,
                icon: "📚",
                tips: [
                    "Focus on building strong fundamentals",
                    "Start preparing for entrance exams early",
                    "Maintain good academic performance (60%+ marks)",
                    "Explore career options and streams"
                ]
            };
        }

        // Check if it's a skills/training stage
        if (stageName.toLowerCase().includes('skill') || stageName.toLowerCase().includes('project') || stageName.toLowerCase().includes('internship') || stageName.toLowerCase().includes('portfolio')) {
            return {
                title: "Skills Development",
                description: `Build practical skills and real-world experience through ${stageName.toLowerCase()}. This stage is crucial for career readiness.`,
                icon: "💼",
                tips: [
                    "Work on real projects and build portfolio",
                    "Gain hands-on experience through internships",
                    "Network with industry professionals",
                    "Learn industry-relevant tools and technologies"
                ]
            };
        }

        // Check if it's a career/job stage
        if (stageName.toLowerCase().includes('career') || stageName.toLowerCase().includes('engineer') || stageName.toLowerCase().includes('doctor') || stageName.toLowerCase().includes('manager') || stageName.toLowerCase().includes('scientist') || stageName.toLowerCase().includes('consultant') || stageName.toLowerCase().includes('analyst') || stageName.toLowerCase().includes('designer')) {
            return {
                title: "Career Stage",
                description: `Your professional career as ${stageName}. Continue learning and growing throughout your career journey.`,
                icon: "🚀",
                tips: [
                    "Keep updating your skills continuously",
                    "Build professional network",
                    "Seek growth opportunities and promotions",
                    "Consider specialization or higher studies"
                ]
            };
        }

        // Check if it's preparation stage
        if (stageName.toLowerCase().includes('preparation') || stageName.toLowerCase().includes('upsc') || stageName.toLowerCase().includes('exam')) {
            return {
                title: "Exam Preparation",
                description: `Dedicated preparation period for ${stageName}. Focus and consistency are key to success.`,
                icon: "📖",
                tips: [
                    "Create a structured study plan",
                    "Practice with previous year question papers",
                    "Join coaching or study groups if needed",
                    "Stay consistent and manage time effectively"
                ]
            };
        }

        // Check if it's certification stage
        if (stageName.toLowerCase().includes('certification') || stageName.toLowerCase().includes('cissp') || stageName.toLowerCase().includes('ceh')) {
            return {
                title: "Professional Certification",
                description: `Earn professional certification in ${stageName} to validate your expertise and enhance career prospects.`,
                icon: "🏆",
                tips: [
                    "Study certification syllabus thoroughly",
                    "Practice with mock tests",
                    "Gain practical experience alongside studying",
                    "Join certification study groups"
                ]
            };
        }

        // Default generic response
        return {
            title: "Career Path Stage",
            description: `${stageName} is an important stage in your career journey. Follow the recommended path and work diligently.`,
            icon: "🎯",
            tips: [
                "Stay focused on your goals",
                "Seek guidance from mentors",
                "Build relevant skills continuously",
                "Network with peers and professionals"
            ]
        };
    };

    // If still no course info, show generic helpful information
    if (!courseInfo) {
        const genericInfo = getGenericInfo(courseName);

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-4">
                            <div className="text-6xl mb-4">{genericInfo.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{genericInfo.title}</h3>
                            <p className="text-lg font-semibold text-blue-600 mb-3">{courseName}</p>
                            <p className="text-gray-700">{genericInfo.description}</p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-bold text-gray-800 mb-2">Key Tips:</h4>
                            <ul className="space-y-2">
                                {genericInfo.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700 text-sm">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                        >
                            Got it!
                        </button>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Show full course info modal for actual courses
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{displayName}</h2>
                            <p className="text-lg text-gray-600">{courseInfo.fullName}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {courseInfo.level}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                                    {courseInfo.category}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Duration & Salary */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-600 font-medium mb-1">Duration</p>
                            <p className="text-lg font-bold text-green-800">{courseInfo.duration}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm text-emerald-600 font-medium mb-1">Average Salary</p>
                            <p className="text-lg font-bold text-emerald-800">{courseInfo.avgSalary}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">About This Course</h3>
                        <p className="text-gray-700 leading-relaxed">{courseInfo.description}</p>
                    </div>

                    {/* Eligibility */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Eligibility Criteria</h3>
                        <p className="text-gray-700">{courseInfo.eligibility}</p>
                    </div>

                    {/* Entrance Exams */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Entrance Exams</h3>
                        <div className="flex flex-wrap gap-2">
                            {courseInfo.entranceExams.map((exam, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium"
                                >
                                    {exam}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Top Colleges */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Top Colleges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courseInfo.topColleges.map((college, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <p className="text-blue-800 font-medium">{college}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Career Options */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Career Opportunities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courseInfo.careerOptions.map((career, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center"
                                >
                                    <svg
                                        className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-indigo-800 font-medium">{career}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Required */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Skills You'll Develop</h3>
                        <div className="flex flex-wrap gap-2">
                            {courseInfo.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(courseInfo.fullName + ' colleges')}`, '_blank')}
                            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                        >
                            Find Colleges
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CourseInfoModal;
