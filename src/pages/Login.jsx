import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const googleDivRef = useRef(null);
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
      const password = formData.password; // Get password from formData
      if (!/@gmail\.(com|in)$/i.test(email)) {
        throw new Error("Please use a @gmail.com or @gmail.in email");
      }
      // DIRECT PASSWORD LOGIN (no OTP)
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.needsSignup && data?.email) {
          toast.info("Account not found. Please sign up first.");
          navigate(`${PathConstants.SIGNUP}?email=${encodeURIComponent(data.email)}`);
          return;
        }
        throw new Error(data?.message || "Login failed");
      }

      toast.success("Login successful! Welcome to CareerVerse");

      // ADMIN MODULE: Redirect admins to admin panel, students to user dashboard
      if (data?.user?.role === 'admin') {
        navigate(PathConstants.ADMIN);
      } else {
        navigate(PathConstants.HOME);
      }
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
        body: JSON.stringify({ credential: response?.credential, mode: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.needsSignup && data?.email) {
          toast.info("Account not found. Please sign up first.");
          navigate(`${PathConstants.SIGNUP}?email=${encodeURIComponent(data.email)}`);
          return;
        }
        throw new Error(data?.message || "Google sign-in failed");
      }
      toast.success("Login successful! Welcome to CareerVerse");
      // ADMIN MODULE: Redirect admins to admin panel, students to user dashboard
      if (data?.user?.role === 'admin') {
        navigate(PathConstants.ADMIN);
      } else {
        navigate(PathConstants.HOME);
      }
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
      const cid = googleClientId || (await (await fetch(`${API_BASE}/api/config/public`)).json()).googleClientId;
      if (!cid) {
        toast.error("Google sign-in not configured");
        return;
      }
      window.google.accounts.id.initialize({ client_id: cid, callback: handleGoogleResponse });
      if (googleDivRef.current && googleDivRef.current.childElementCount === 0) {
        window.google.accounts.id.renderButton(googleDivRef.current, { theme: "outline", size: "large", type: "standard" });
      }
      window.google.accounts.id.prompt();
    } catch (_) {
      toast.error("Google sign-in not configured");
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/config/public`);
        const cfg = await res.json();
        if (!mounted) return;
        const cid = cfg?.googleClientId;
        if (cid && window.google) {
          setGoogleClientId(cid);
          window.google.accounts.id.initialize({ client_id: cid, callback: handleGoogleResponse });
          if (googleDivRef.current && googleDivRef.current.childElementCount === 0) {
            window.google.accounts.id.renderButton(googleDivRef.current, { theme: "outline", size: "large", type: "standard" });
          }
        }
      } catch (_) { }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              disabled={step === 2}
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
              disabled={step === 2}
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => navigate(PathConstants.FORGOTPASSWORD)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Google Sign-in (official button) */}
        <div className="mt-4">
          <div ref={googleDivRef} className="flex justify-center" />
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
