import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
// Firebase imports removed - using mock data instead
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { streamInfo } from "../data/aptitudeQuestions";
import { Link } from "react-router-dom";
import PathConstants from "../routes/PathConstants";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const PersonalizedDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    age: "",
    gender: "",
    class: "",
    location: "",
    interests: [],
    academicPerformance: {
      math: 0,
      science: 0,
      english: 0,
      socialStudies: 0
    }
  });

  const [user, setUser] = useState(null);
  const [showStreamChangeModal, setShowStreamChangeModal] = useState(false);
  const [changingStream, setChangingStream] = useState(false);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  // Handle stream change - reset stream and force common test
  const handleStreamChange = async () => {
    try {
      setChangingStream(true);
      const res = await fetch(`${API_BASE}/api/career-test/change-stream`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to reset stream');

      // Refresh user data
      await fetchUserProfile();
      setShowStreamChangeModal(false);
      alert('✅ Stream reset! You can now take the common aptitude test to discover your best fit.');
    } catch (error) {
      alert('Failed to reset stream. Please try again.');
    } finally {
      setChangingStream(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem("cv_dashboard");
      if (cached) {
        const c = JSON.parse(cached);
        if (c.user) setUser(c.user);
        if (c.profileData) setProfileData(c.profileData);
        if (c.recommendations) setRecommendations(c.recommendations);
        setLoading(false);
      }
    } catch (_) { }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      let currentUser = null;
      try {
        const ur = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (ur.ok) {
          const du = await ur.json();
          currentUser = du.user;
          setUser(du.user);
        }
      } catch (_) { }

      const pr = await fetch(`${API_BASE}/api/user/profile`, { credentials: "include" });
      if (pr.ok) {
        const data = await pr.json();
        const p = data.profile || {};
        const pd = {
          age: p?.age != null ? String(p.age) : "",
          gender: p?.gender || "",
          class: p?.class_level || "",
          location: p?.location || "",
          interests: Array.isArray(p?.interests) ? p.interests : [],
          academicPerformance: p?.academic_performance || { math: 0, science: 0, english: 0, socialStudies: 0 },
        };
        setUserProfile({ profile: p });
        setProfileData(pd);
        const rec = await generateRecommendations(pd);
        try {
          localStorage.setItem("cv_dashboard", JSON.stringify({ user: currentUser, profileData: pd, recommendations: rec }));
        } catch (_) { }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const payload = {
        age: profileData.age ? Number(profileData.age) : null,
        gender: profileData.gender || null,
        class_level: profileData.class || null,
        location: profileData.location || null,
        interests: profileData.interests || [],
        academic_performance: profileData.academicPerformance || null,
      };
      await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setUserProfile({ ...userProfile, profile: payload });
      const rec = await generateRecommendations(profileData);
      try {
        localStorage.setItem("cv_dashboard", JSON.stringify({ user, profileData, recommendations: rec }));
      } catch (_) { }
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const generateRecommendations = async (profile) => {
    // AI-like recommendation algorithm based on profile
    const streamScores = {
      science: 0,
      commerce: 0,
      technology: 0,
      arts: 0,
      design: 0
    };

    // Academic performance influence
    const { academicPerformance } = profile;
    streamScores.science += (academicPerformance.math + academicPerformance.science) * 0.4;
    streamScores.technology += (academicPerformance.math + academicPerformance.science) * 0.3;
    streamScores.commerce += (academicPerformance.math + academicPerformance.socialStudies) * 0.3;
    streamScores.arts += (academicPerformance.english + academicPerformance.socialStudies) * 0.4;
    streamScores.design += (academicPerformance.english) * 0.2;

    // Interest-based scoring
    if (profile.interests.includes("problem-solving")) {
      streamScores.science += 20;
      streamScores.technology += 25;
    }
    if (profile.interests.includes("creativity")) {
      streamScores.arts += 25;
      streamScores.design += 30;
    }
    if (profile.interests.includes("business")) {
      streamScores.commerce += 30;
    }
    if (profile.interests.includes("technology")) {
      streamScores.technology += 25;
    }
    if (profile.interests.includes("research")) {
      streamScores.science += 20;
    }

    // Normalize scores to percentages
    const maxScore = Math.max(...Object.values(streamScores));
    const normalizedScores = {};
    Object.entries(streamScores).forEach(([stream, score]) => {
      normalizedScores[stream] = Math.round((score / maxScore) * 100);
    });

    // Generate specific recommendations
    const topStreams = Object.entries(normalizedScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Await colleges from API
    const colleges = await generateCollegeRecommendations(profile.location, topStreams);

    const rec = {
      scores: normalizedScores,
      topStreams,
      courses: generateCourseRecommendations(topStreams),
      colleges,
      resources: generateResourceRecommendations(topStreams)
    };
    setRecommendations(rec);
    return rec;
  };

  const generateCourseRecommendations = (topStreams) => {
    const courseMap = {
      science: ["B.Sc Physics", "MBBS", "B.Tech Biotechnology"],
      commerce: ["B.Com", "BBA", "CA Foundation"],
      technology: ["B.Tech CSE", "B.Sc Data Science", "Diploma in IT"],
      arts: ["BA Literature", "BA History", "BA Journalism"],
      design: ["B.Des", "BFA", "Diploma in Graphic Design"]
    };

    return topStreams.flatMap(([stream]) =>
      courseMap[stream]?.slice(0, 2) || []
    ).slice(0, 6);
  };

  const generateCollegeRecommendations = async (location, topStreams) => {
    try {
      // Fetch real colleges from database based on streams
      const streamTypes = topStreams.map(([stream]) => stream).join(',');
      const url = `${API_BASE}/api/colleges?type=${streamTypes}&limit=4`;

      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        return data.colleges || [];
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }

    // Fallback to empty array if API fails
    return [];
  };

  const generateResourceRecommendations = (topStreams) => {
    const resourceMap = {
      science: ["NCERT Science Books", "Khan Academy Physics", "Biology Online Labs"],
      commerce: ["Accounting Basics Course", "Economics Study Material", "Business Case Studies"],
      technology: ["Coding Bootcamp", "Python Programming Course", "Data Structures Tutorial"],
      arts: ["Creative Writing Workshop", "History Documentary Series", "Literature Analysis Guide"],
      design: ["Design Thinking Course", "Adobe Creative Suite Tutorial", "UI/UX Design Basics"]
    };

    return topStreams.flatMap(([stream]) =>
      resourceMap[stream]?.slice(0, 2) || []
    ).slice(0, 6);
  };

  const academicChart = profileData.academicPerformance ? {
    labels: ["Mathematics", "Science", "English", "Social Studies"],
    datasets: [{
      label: "Academic Performance",
      data: [
        profileData.academicPerformance.math,
        profileData.academicPerformance.science,
        profileData.academicPerformance.english,
        profileData.academicPerformance.socialStudies
      ],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f680",
      tension: 0.4
    }]
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || user?.displayName || "Student"}!
          </h1>
          <p className="text-gray-600 text-lg">Your personalized CareerVerse dashboard</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { title: "Take Aptitude Test", icon: "🧠", path: PathConstants.APTITUDE, color: "from-blue-500 to-purple-600" },
            { title: "Explore Career Paths", icon: "🛤️", path: PathConstants.CAREERPATHS, color: "from-green-500 to-emerald-600" },
            { title: "Timeline Tracker", icon: "📅", path: PathConstants.TIMELINE, color: "from-purple-500 to-pink-600" }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <h3 className="font-bold text-lg">{action.title}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Stream Information Card - Shows if user has selected stream */}
        {user?.selected_stream && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-blue-500"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  🎯 Your Selected Stream
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Stream:</span> {user.selected_stream}
                  </p>
                  {user.education_level && (
                    <p className="text-gray-600 text-sm">
                      {user.education_level} {user.class_or_year && `- ${user.class_or_year}`}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    💡 You'll receive stream-specific aptitude questions tailored to {user.selected_stream}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowStreamChangeModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium whitespace-nowrap"
              >
                🔄 Change Stream
              </button>
            </div>
          </motion.div>
        )}

        {/* Stream Change Confirmation Modal */}
        {showStreamChangeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Change Your Stream?
              </h3>
              <p className="text-gray-700 mb-6">
                This will reset your current stream selection (<strong>{user?.selected_stream}</strong>)
                and allow you to take the common aptitude test again to discover the best stream for you.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ On your next test session, you'll receive general aptitude questions
                  that will help determine your ideal stream based on your skills and interests.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStreamChange}
                  disabled={changingStream}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50"
                >
                  {changingStream ? 'Resetting...' : 'Yes, Reset Stream'}
                </button>
                <button
                  onClick={() => setShowStreamChangeModal(false)}
                  disabled={changingStream}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Your Profile</h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editMode ? "Save" : "Edit"}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={profileData.class}
                    onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Class</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="City, State"
                  />
                </div>
                <button
                  onClick={updateProfile}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Update Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{profileData.age || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{profileData.class || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{profileData.location || "Not set"}</span>
                </div>
              </div>
            )}

            {/* Academic Performance Chart */}
            {academicChart && (
              <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Academic Performance</h4>
                <div className="h-48">
                  <Line
                    data={academicChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Recommendations Section */}
          <div className="lg:col-span-2 space-y-6">
            {recommendations && (
              <>
                {/* Stream Recommendations */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recommended Streams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.topStreams.map(([streamKey, score], index) => {
                      const stream = streamInfo[streamKey];
                      return (
                        <div key={streamKey} className="text-center p-4 border border-gray-200 rounded-xl">
                          <div
                            className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: stream.color }}
                          >
                            #{index + 1}
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">{stream.name}</h4>
                          <p className="text-2xl font-bold mb-2" style={{ color: stream.color }}>
                            {score}%
                          </p>
                          <p className="text-xs text-gray-600">{stream.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Course Recommendations */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recommendations.courses.map((course, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800">{course}</h4>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* College Recommendations */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Colleges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.colleges.map((college, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                        <h4 className="font-bold text-gray-800">{college.name}</h4>
                        <p className="text-sm text-gray-600">{college.location}</p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mt-2">
                          {college.stream}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Study Resources */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Study Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recommendations.resources.map((resource, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 text-sm">{resource}</h4>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Setup Profile CTA */}
            {!recommendations && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h3>
                <p className="text-gray-600 mb-6">
                  Set up your profile to get personalized recommendations for courses, colleges, and career paths.
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Complete Profile
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;