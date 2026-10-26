import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PathConstants from "../../routes/PathConstants";

const ManageTestsPage = () => {
    const [tests, setTests] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: "", status: "" });
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

    useEffect(() => {
        fetchTests();
        fetchStats();
    }, [filter]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter.category) params.append("category", filter.category);
            if (filter.status) params.append("status", filter.status);
            params.append("limit", "100");

            const res = await fetch(`${API_BASE}/api/admin/tests?${params}`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch tests");

            const data = await res.json();
            setTests(data.tests || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/tests/stats`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch stats");

            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const getTopStreams = (topStreams) => {
        if (!topStreams) return "N/A";
        try {
            const streams = typeof topStreams === "string" ? JSON.parse(topStreams) : topStreams;
            if (Array.isArray(streams) && streams.length > 0) {
                return streams.slice(0, 3).map((s) => s.stream).join(", ");
            }
            return "N/A";
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 mb-6 text-white bg-purple-600 rounded-md shadow-md">
                <h1 className="text-3xl font-bold">Manage Tests</h1>
                <Link
                    to={PathConstants.ADMIN}
                    className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-700"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Statistics Overview */}
            {stats && (
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                    {stats.byCategory?.map((cat) => (
                        <div key={cat.category} className="p-4 bg-white rounded-lg shadow">
                            <h3 className="mb-2 text-lg font-semibold capitalize">{cat.category} Tests</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Total</p>
                                    <p className="text-xl font-bold">{cat.total}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Completed</p>
                                    <p className="text-xl font-bold text-green-600">{cat.completed}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">In Progress</p>
                                    <p className="text-xl font-bold text-yellow-600">{cat.in_progress}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 p-4 mb-4 bg-white rounded-md shadow md:grid-cols-2">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Filter by Category
                    </label>
                    <select
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">All Categories</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Filter by Status
                    </label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="abandoned">Abandoned</option>
                    </select>
                </div>
            </div>

            {/* Tests Table */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
            ) : (
                <div className="p-4 bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left table-auto">
                            <thead className="text-gray-600 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Started</th>
                                    <th className="px-4 py-3">Completed</th>
                                    <th className="px-4 py-3">Top Streams</th>
                                    <th className="px-4 py-3">Confidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tests.length > 0 ? (
                                    tests.map((test, index) => (
                                        <tr key={test.id} className="hover:bg-gray-100">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">{test.user_name}</p>
                                                    <p className="text-xs text-gray-500">{test.user_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                                                    {test.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${test.status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : test.status === "in_progress"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {test.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs">{formatDate(test.start_time)}</td>
                                            <td className="px-4 py-3 text-xs">
                                                {test.completion_time ? formatDate(test.completion_time) : "N/A"}
                                            </td>
                                            <td className="px-4 py-3">{getTopStreams(test.top_streams)}</td>
                                            <td className="px-4 py-3">
                                                {test.confidence_level ? (
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full capitalize ${test.confidence_level === "high"
                                                                ? "bg-green-100 text-green-800"
                                                                : test.confidence_level === "medium"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-orange-100 text-orange-800"
                                                            }`}
                                                    >
                                                        {test.confidence_level}
                                                    </span>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-gray-500">
                                            No tests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tests.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {tests.length} test session{tests.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            )}

            {/* Stream Distribution */}
            {stats?.streamDistribution && stats.streamDistribution.length > 0 && (
                <div className="p-6 mt-6 bg-white rounded-lg shadow">
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">
                        Recommended Stream Distribution
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        {stats.streamDistribution.map((item) => (
                            <div key={item.recommended_stream} className="p-4 border border-gray-200 rounded">
                                <p className="text-sm font-medium text-gray-600 capitalize">
                                    {item.recommended_stream}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTestsPage;
