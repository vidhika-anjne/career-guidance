import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    try {
      const email = String(formData.email || "").trim();
      if (!/@gmail\.com$/i.test(email)) {
        throw new Error("Please use a @gmail.com email");
      }
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      toast.success("Login successful! Welcome to CareerVerse");
      navigate(PathConstants.HOME);
    } catch (err) {
      toast.error(err.message || "Login failed");
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
      toast.success("Login successful! Welcome to CareerVerse");
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CareerVerse account</p>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 text-center">
            Use your Gmail address and password, or continue with Google below.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
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
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Google Login Button */}
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
            Don't have an account?{" "}
            <button
              onClick={() => navigate(PathConstants.SIGNUP)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up here
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

export default Login;
