import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUserModal, setEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE}/api/admin/users?search=${encodeURIComponent(search)}&limit=100`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user: ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== id));
      toast.success(`User ${name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message);
    }
  };

  const promoteToAdmin = async (id, name) => {
    if (!window.confirm(`Promote ${name} to admin?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/user/${id}/promote`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to promote user");
      }

      // Update user in local state
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: "admin" } : user
        )
      );
      toast.success(`User ${name} promoted to admin`);
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-6 text-white bg-blue-600 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link
          to={PathConstants.ADMIN}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
        >
          ← Back to Dashboard
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
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
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
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Tests</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{user.name || "N/A"}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {user.class_level || "Not Set"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.testsCompleted || 0} completed</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                            }`}
                        >
                          {user.role || "student"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {user.role !== "admin" && (
                            <button
                              onClick={() => promoteToAdmin(user.id, user.name)}
                              className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                              title="Promote to Admin"
                            >
                              Promote
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user.id, user.name)}
                            className="px-3 py-1 text-xs text-white bg-red-500 rounded-md hover:bg-red-600"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      {search ? `No users found matching "${search}"` : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {users.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
