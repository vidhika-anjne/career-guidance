import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Signup failed");
      toast.success("Account created successfully! Welcome to CareerVerse");
      navigate(PathConstants.HOME);
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: response?.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Google sign-in failed");
      toast.success("Welcome! Account created");
      navigate(PathConstants.HOME);
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!window.google) {
        toast.error("Google sign-in not configured");
        return;
      }
      const res = await fetch(`${API_BASE}/api/config/public`);
      const cfg = await res.json();
      const clientId = cfg?.googleClientId;
      if (!clientId) {
        toast.error("Google sign-in not configured");
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.prompt();
    } catch (_) {
      toast.error("Google sign-in not configured");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join CareerVerse</p>
        </div>

        {/* Demo Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700 text-center">
            Create with email/password or continue using Google.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Continue with Google
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate(PathConstants.LOGIN)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
          <button
            onClick={() => navigate(PathConstants.ABOUT)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
