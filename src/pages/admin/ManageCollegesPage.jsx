import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PathConstants from "../../routes/PathConstants";

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCollege, setCurrentCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    type: "",
    ownership: "government",
    fees_min: "",
    fees_max: "",
    website: "",
    email: "",
    phone: "",
    description: "",
  });
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchColleges();
  }, [searchTerm]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/admin/colleges?search=${encodeURIComponent(searchTerm)}&limit=100`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) throw new Error("Failed to fetch colleges");

      const data = await res.json();
      setColleges(data.colleges || []);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (college = null) => {
    setModalOpen(true);
    if (college) {
      setCurrentCollege(college);
      setFormData({
        name: college.name || "",
        city: college.city || "",
        state: college.state || "",
        type: college.type || "",
        ownership: college.ownership || "government",
        fees_min: college.fees_min || "",
        fees_max: college.fees_max || "",
        website: college.website || "",
        email: college.email || "",
        phone: college.phone || "",
        description: college.description || "",
      });
    } else {
      setCurrentCollege(null);
      setFormData({
        name: "",
        city: "",
        state: "",
        type: "",
        ownership: "government",
        fees_min: "",
        fees_max: "",
        website: "",
        email: "",
        phone: "",
        description: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = currentCollege
        ? `${API_BASE}/api/admin/college/${currentCollege.id}`
        : `${API_BASE}/api/admin/college`;

      const method = currentCollege ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save college");
      }

      toast.success(
        currentCollege
          ? "College updated successfully"
          : "College added successfully"
      );
      setModalOpen(false);
      fetchColleges();
    } catch (error) {
      console.error("Error saving college:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete: ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/college/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete college");
      }

      toast.success(`College "${name}" deleted successfully`);
      fetchColleges();
    } catch (error) {
      console.error("Error deleting college:", error);
      toast.error(error.message);
    }
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="px-6 py-4 text-white bg-gray-800 shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold">Manage Colleges</h1>
          <nav className="flex space-x-6">
            <Link
              to={PathConstants.ADMIN}
              className="transition duration-300 hover:text-green-400"
            >
              Admin Dashboard
            </Link>
            <Link
              to={PathConstants.MANAGEUSERS}
              className="transition duration-300 hover:text-green-400"
            >
              Manage Users
            </Link>
          </nav>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            + Add College
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by college name or city..."
          className="w-full p-3 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-12 h-12 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Colleges Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">City</th>
                    <th className="px-4 py-3 text-left">State</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Ownership</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.length > 0 ? (
                    colleges.map((college, index) => (
                      <tr key={college.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{college.name}</td>
                        <td className="px-4 py-3">{college.city}</td>
                        <td className="px-4 py-3">{college.state}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {capitalizeWords(college.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${college.ownership === 'government'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                            }`}>
                            {capitalizeWords(college.ownership)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openModal(college)}
                            className="px-3 py-1 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(college.id, college.name)}
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        {searchTerm ? `No colleges found matching "${searchTerm}"` : "No colleges found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {colleges.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {colleges.length} college{colleges.length !== 1 ? "s" : ""}
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 mx-4 bg-white rounded shadow-lg max-h-screen overflow-y-auto">
              <h2 className="mb-4 text-2xl font-semibold">
                {currentCollege ? "Edit College" : "Add College"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="technology">Technology</option>
                      <option value="commerce">Commerce</option>
                      <option value="arts">Arts</option>
                      <option value="design">Design</option>
                      <option value="science">Science</option>
                      <option value="medical">Medical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Ownership</label>
                    <select
                      name="ownership"
                      value={formData.ownership}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    >
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Min Fees (₹)</label>
                    <input
                      type="number"
                      name="fees_min"
                      value={formData.fees_min}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Max Fees (₹)</label>
                    <input
                      type="number"
                      name="fees_max"
                      value={formData.fees_max}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-1 text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    {currentCollege ? "Update" : "Add"} College
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageColleges;
