import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";
import { importantDates, scholarships } from "../data/timelineData";

const TimelineTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("calendar"); // calendar, list, upcoming
  const [filterStream, setFilterStream] = useState("all");
  const [customEvents, setCustomEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    type: "personal",
    description: "",
    priority: "medium"
  });
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const isValidTitle = (t) => /[A-Za-z]/.test(String(t || "").trim());

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        setCustomEvents(items.map(it => ({ ...it, category: it.category || "personal", stream: "all", isCustom: true })));
      } catch (_) { }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combine all events
  const allEvents = [
    ...importantDates.map(event => ({ ...event, category: "exam" })),
    ...scholarships.map(scholarship => ({
      id: `scholarship-${scholarship.id}`,
      title: scholarship.title,
      date: scholarship.deadline,
      type: "scholarship",
      stream: scholarship.stream,
      description: `Amount: ${scholarship.amount} | ${scholarship.eligibility}`,
      priority: "medium",
      category: "scholarship"
    })),
    ...customEvents
  ];

  // Filter events
  const filteredEvents = allEvents.filter(event => {
    if (filterStream !== "all" && event.stream !== filterStream && event.stream !== "all") {
      return false;
    }
    return true;
  });

  // Get upcoming events (next 30 days)
  const upcomingEvents = filteredEvents
    .filter(event => {
      const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
      const today = new Date();
      const thirtyDaysFromNow = addDays(today, 30);
      return isAfter(eventDate, today) && isBefore(eventDate, thirtyDaysFromNow);
    })
    .sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date;
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date;
      return dateA - dateB;
    });

  const addCustomEvent = async () => {
    const title = String(newEvent.title || "").trim();
    if (!isValidTitle(title)) {
      alert("Title must contain letters and cannot be only numbers");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          date: newEvent.date,
          type: "personal",
          description: newEvent.description,
          priority: newEvent.priority,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add event");
      const item = { ...data.item, stream: "all", isCustom: true };
      setCustomEvents((prev) => [...prev, item]);
      setNewEvent({ title: "", date: new Date(), type: "personal", description: "", priority: "medium" });
      setShowAddEvent(false);
    } catch (e) {
      alert(e.message || "Failed to add event");
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        let msg = "Failed to delete event";
        try { const d = await res.json(); if (d?.message) msg = d.message; } catch (_) { }
        throw new Error(msg);
      }
      setCustomEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete event");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981"
    };
    return colors[priority] || "#6b7280";
  };

  const getTypeIcon = (type) => {
    const icons = {
      registration: "📝",
      exam: "📚",
      scholarship: "💰",
      personal: "📌",
      deadline: "⏰"
    };
    return icons[type] || "📅";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 cursor-default">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Academic Timeline Tracker</h1>
          <p className="text-gray-600 text-lg">Stay on top of important dates and deadlines</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {["calendar", "list", "upcoming"].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${view === viewType
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>

            {/* Stream Filter */}
            <div className="flex items-center gap-4">
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Streams</option>
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="technology">Technology</option>
                <option value="arts">Arts</option>
                <option value="design">Design</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddEvent(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Add Event
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events Alert */}
        {upcomingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.slice(0, 3).map((event) => {
                const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
                const daysLeft = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={`up-${event.type}-${event.id}`} className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(event.type)}</span>
                      <h4 className="font-bold text-gray-800 text-sm">{event.title}</h4>
                      {event.isCustom && (
                        <button
                          onClick={() => window.confirm('Delete this event?') && deleteEvent(event.id)}
                          className="ml-auto text-red-600 hover:text-red-800 text-xs"
                          title="Delete event"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">
                        {format(eventDate, "MMM dd, yyyy")}
                      </span>
                      <span className={`text-xs font-bold ${daysLeft <= 7 ? 'text-red-600' : 'text-orange-600'}`}>
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {view === "upcoming" && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events (Next 30 Days)</h3>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
                    const daysLeft = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getPriorityColor(event.priority) }}
                        >
                          <span className="text-lg">{getTypeIcon(event.type)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{event.title}</h4>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(eventDate, "EEEE, MMMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${daysLeft <= 7 ? 'text-red-600' : 'text-orange-600'}`}>
                            {daysLeft}
                          </span>
                          <p className="text-xs text-gray-500">days left</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📅</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No upcoming events</h4>
                  <p className="text-gray-600">All caught up! Check back later for new deadlines.</p>
                </div>
              )}
            </motion.div>
          )}

          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">All Events</h3>
              <div className="space-y-6">
                {["exam", "registration", "scholarship"].map((category) => {
                  const categoryEvents = filteredEvents.filter(event =>
                    (category === "scholarship" && event.category === "scholarship") ||
                    (category !== "scholarship" && event.type === category)
                  );

                  if (categoryEvents.length === 0) return null;

                  return (
                    <div key={category}>
                      <h4 className="text-lg font-bold text-gray-700 mb-3 capitalize">
                        {category === "scholarship" ? "Scholarships" : `${category}s`}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryEvents.map((event) => {
                          const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
                          return (
                            <motion.div
                              key={`ls-${event.type}-${event.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getTypeIcon(event.type)}</span>
                                <h5 className="font-bold text-gray-800 text-sm">{event.title}</h5>
                                {event.isCustom && (
                                  <button
                                    onClick={() => window.confirm('Delete this event?') && deleteEvent(event.id)}
                                    className="ml-auto text-red-600 hover:text-red-800 text-xs"
                                    title="Delete event"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-500">
                                  {format(eventDate, "MMM dd, yyyy")}
                                </span>
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: getPriorityColor(event.priority) }}
                                >
                                  {event.priority}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Calendar View</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    inline
                    highlightDates={filteredEvents.map(event => ({
                      date: typeof event.date === 'string' ? parseISO(event.date) : event.date,
                      className: "highlighted-date"
                    }))}
                    className="w-full"
                  />
                </div>

                {/* Events for Selected Date */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">
                    Events on {format(selectedDate, "MMM dd, yyyy")}
                  </h4>
                  <div className="space-y-3">
                    {filteredEvents
                      .filter(event => {
                        const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
                        return format(eventDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                      })
                      .map((event) => (
                        <div key={`cal-${event.type}-${event.id}`} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getTypeIcon(event.type)}</span>
                            <h5 className="font-bold text-gray-800 text-sm">{event.title}</h5>
                            {event.isCustom && (
                              <button
                                onClick={() => window.confirm('Delete this event?') && deleteEvent(event.id)}
                                className="ml-auto text-red-600 hover:text-red-800 text-xs"
                                title="Delete event"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{event.description}</p>
                        </div>
                      ))}
                    {filteredEvents.filter(event => {
                      const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
                      return format(eventDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    }).length === 0 && (
                        <p className="text-gray-500 text-sm">No events on this date</p>
                      )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Personal Event</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <DatePicker
                      selected={newEvent.date}
                      onChange={(date) => setNewEvent({ ...newEvent, date })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Event description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomEvent}
                    disabled={!isValidTitle(newEvent.title)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    Add Event
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineTracker;