import React, { useState, useEffect } from "react";
// Firebase imports removed - using mock data instead
import { Link } from "react-router-dom";
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
  });
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Mock fetch colleges function
  const fetchColleges = async () => {
    setLoading(true);
    // Mock college data
    const mockColleges = [
      { id: "1", name: "Sample Engineering College", city: "Mumbai", state: "Maharashtra", type: "technology" },
      { id: "2", name: "Commerce Institute", city: "New Delhi", state: "Delhi", type: "commerce" },
      { id: "3", name: "Arts University", city: "Bangalore", state: "Karnataka", type: "arts" }
    ];
    setColleges(mockColleges);
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Open Add/Edit Modal
  const openModal = (college = null) => {
    setModalOpen(true);
    if (college) {
      setCurrentCollege(college);
      setFormData(college);
    } else {
      setCurrentCollege(null);
      setFormData({ name: "", city: "", state: "", type: "" });
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or Update College
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      name: capitalizeWords(formData.name),
      city: capitalizeWords(formData.city),
      state: capitalizeWords(formData.state),
      type: capitalizeWords(formData.type),
    };

    try {
      if (currentCollege) {
        // Mock update existing college
        console.log("Updating college:", formattedData);
      } else {
        // Mock add new college
        console.log("Adding new college:", formattedData);
      }
      fetchColleges();
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating college: ", error);
    }
  };

  // Delete College
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      try {
        // Mock delete college
        console.log("Deleting college with id:", id);
        fetchColleges();
      } catch (error) {
        console.error("Error deleting college: ", error);
      }
    }
  };

  // Filtered Colleges (Search)
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Add College
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by college name..."
          className="w-full mb-4 input input-bordered"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Colleges Table */}
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>#</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredColleges.map((college, index) => (
                <tr key={college.id} className="hover:bg-gray-100">
                  <td>{index + 1}</td>
                  <td>{capitalizeWords(college.name)}</td>
                  <td>{capitalizeWords(college.city)}</td>
                  <td>{capitalizeWords(college.state)}</td>
                  <td>{capitalizeWords(college.type)}</td>
                  <td>
                    <button
                      onClick={() => openModal(college)}
                      className="px-3 py-1 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(college.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded shadow-lg w-96">
              <h2 className="mb-4 text-2xl font-semibold">
                {currentCollege ? "Edit College" : "Add College"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Arts">Arts</option>
                    <option value="Design">Design</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Save
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
