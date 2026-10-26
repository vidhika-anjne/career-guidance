import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { careerPathMappings } from "../data/careerPathMapping";
import { streamInfo } from "../data/aptitudeQuestions";
import CourseInfoModal from "./CourseInfoModal";

const CareerPathMapping = () => {
  const [selectedStream, setSelectedStream] = useState("science");
  const [selectedPath, setSelectedPath] = useState(0);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const currentPaths = careerPathMappings[selectedStream]?.paths || [];
  const currentPath = currentPaths[selectedPath];

  const handleCourseClick = (courseName) => {
    setSelectedCourse(courseName);
    setCourseModalOpen(true);
  };

  const getLevelColor = (level) => {
    const colors = {
      "12th": "#ef4444",
      "UG": "#3b82f6",
      "PG": "#10b981",
      "PhD": "#8b5cf6",
      "Intermediate": "#f59e0b",
      "Final": "#06b6d4",
      "Skills": "#84cc16",
      "Certification": "#f97316",
      "Preparation": "#ec4899",
      "Career": "#22c55e"
    };
    return colors[level] || "#6b7280";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Career Path Roadmaps</h1>
          <p className="text-gray-600 text-lg">Explore detailed career journeys from 12th grade to professional success</p>
        </motion.div>

        {/* Stream Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select a Stream</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(streamInfo).map(([key, stream]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedStream(key);
                  setSelectedPath(0);
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedStream === key
                  ? `border-2 text-white`
                  : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                style={{
                  backgroundColor: selectedStream === key ? stream.color : 'white',
                  borderColor: selectedStream === key ? stream.color : '#e5e7eb',
                  color: selectedStream === key ? 'white' : '#374151'
                }}
              >
                <div className="text-center">
                  <h4 className="font-bold text-lg">{stream.name}</h4>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Path Selection */}
        {currentPaths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choose a Career Path</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentPaths.map((path, index) => (
                <motion.button
                  key={path.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPath(index)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedPath === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <h4 className="font-bold text-lg text-gray-800">{path.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {path.stages.length} stages • {path.stages[path.stages.length - 1].salary}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Career Path Visualization */}
        {currentPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentPath.title}
            </h3>

            {/* Desktop View - Horizontal Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>

                {/* Timeline Stages */}
                <div className="relative flex justify-between items-center">
                  {currentPath.stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="relative flex flex-col items-center"
                      style={{ width: `${100 / currentPath.stages.length}%` }}
                    >
                      {/* Stage Circle */}
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10"
                        style={{ backgroundColor: getLevelColor(stage.level) }}
                      >
                        {index + 1}
                      </div>

                      {/* Stage Info Card - ALL CLICKABLE */}
                      <button
                        onClick={() => handleCourseClick(stage.course)}
                        className="mt-4 bg-white border-2 rounded-xl p-4 shadow-md max-w-xs hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        style={{ borderColor: getLevelColor(stage.level) }}
                      >
                        <div className="text-center">
                          <h4 className="font-bold text-gray-800 mb-1">{stage.level}</h4>
                          <p className="text-sm font-semibold text-gray-700 mb-2">{stage.course}</p>
                          <p className="text-xs text-gray-500 mb-2">Duration: {stage.duration}</p>
                          {stage.exams && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-gray-600 mb-1">Entrance Exams:</p>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {stage.exams.map((exam, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    {exam}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {stage.salary && (
                            <p className="text-xs font-bold text-green-600">{stage.salary}</p>
                          )}
                          <p className="text-xs text-blue-600 mt-2 font-medium">👆 Click for details</p>
                        </div>
                      </button>

                      {/* Arrow */}
                      {index < currentPath.stages.length - 1 && (
                        <div className="absolute top-8 left-full w-8 h-1 bg-gray-300 transform -translate-y-1/2">
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile View - Vertical Timeline */}
            <div className="md:hidden">
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

                {/* Timeline Stages */}
                <div className="space-y-8">
                  {currentPath.stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="relative flex items-start"
                    >
                      {/* Stage Circle */}
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10"
                        style={{ backgroundColor: getLevelColor(stage.level) }}
                      >
                        {index + 1}
                      </div>

                      {/* Stage Info Card - ALL CLICKABLE */}
                      <button
                        onClick={() => handleCourseClick(stage.course)}
                        className="ml-6 bg-white border-2 rounded-xl p-4 shadow-md flex-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        style={{ borderColor: getLevelColor(stage.level) }}
                      >
                        <h4 className="font-bold text-gray-800 mb-1">{stage.level}</h4>
                        <p className="text-sm font-semibold text-gray-700 mb-2">{stage.course}</p>
                        <p className="text-xs text-gray-500 mb-2">Duration: {stage.duration}</p>
                        {stage.exams && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Entrance Exams:</p>
                            <div className="flex flex-wrap gap-1">
                              {stage.exams.map((exam, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {exam}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {stage.salary && (
                          <p className="text-xs font-bold text-green-600">{stage.salary}</p>
                        )}
                        <p className="text-xs text-blue-600 mt-2 font-medium">👆 Tap for details</p>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Path Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Path Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Total Duration:</span>
                  <p className="text-gray-800">
                    {currentPath.stages.reduce((total, stage) => {
                      const years = parseInt(stage.duration.match(/\d+/)?.[0] || 0);
                      return total + years;
                    }, 0)} years (approx.)
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Key Exams:</span>
                  <p className="text-gray-800">
                    {[...new Set(currentPath.stages.flatMap(stage => stage.exams || []))].slice(0, 3).join(", ")}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Expected Salary:</span>
                  <p className="text-gray-800 font-bold text-green-600">
                    {currentPath.stages[currentPath.stages.length - 1].salary}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Course Information Modal */}
        <CourseInfoModal
          isOpen={courseModalOpen}
          onClose={() => setCourseModalOpen(false)}
          courseName={selectedCourse}
        />
      </div>
    </div>
  );
};

export default CareerPathMapping;