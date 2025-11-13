import React, { useEffect, useState } from "react";
// Firebase imports removed - using mock data instead
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUserModal, setEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock fetch users function
  const fetchUsers = async () => {
    try {
      // Mock user data
      const mockUsers = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "user" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin" },
        { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "user" }
      ];
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mock delete user
  const deleteUser = async (id) => {
    try {
      console.log("Deleting user with id:", id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User Deleted successfully from database");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Mock update user
  const updateUser = async (id, updatedData) => {
    try {
      console.log("Updating user:", id, updatedData);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user
        )
      );
      setEditUserModal(false);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  // Mock promote user to admin
  const promoteToAdmin = async (id) => {
    try {
      console.log("Promoting user to admin:", id);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: "admin" } : user
        )
      );
    } catch (error) {
      console.error("Error promoting user: ", error);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setCurrentUser(user);
    setEditUserModal(true);
  };

  // Handle search functionality
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-6 text-white bg-blue-600 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link
          to={PathConstants.ADMIN} // Link to Admin Dashboard
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
        >
          Go to Admin Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 mb-4 bg-white rounded-md shadow">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow">
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left table-auto">
              <thead className="text-gray-600 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "Admin"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          {user.role !== "Admin" && (
                            <button
                              onClick={() => promoteToAdmin(user.id)}
                              className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                            >
                              Promote to Admin
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Edit User</h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue={currentUser.name}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue={currentUser.email}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditUserModal(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateUser(currentUser.id, {
                    name: currentUser.name,
                    email: currentUser.email,
                  })
                }
                className="px-4 py-2 text-white bg-blue-500 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
