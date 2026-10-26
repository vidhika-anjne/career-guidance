import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // ADAPTIVE TEST FIELDS (OPTIONAL)
    education_level: "",
    class_or_year: "",
    stream_status: "",
    selected_stream: "",
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
      const nameStr = String(formData.name || "").trim();
      if (!/^[A-Za-z ]+$/.test(nameStr) || nameStr.replace(/\s/g, "").length < 2) {
        throw new Error("Name should contain letters and spaces only");
      }
      if (step === 1) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        // Build payload with optional adaptive fields
        const payload = {
          name: nameStr,
          email: formData.email,
          password: formData.password
        };

        // Include adaptive test fields only if provided (BACKWARD COMPATIBLE)
        if (formData.education_level) payload.education_level = formData.education_level;
        if (formData.class_or_year) payload.class_or_year = formData.class_or_year;
        if (formData.stream_status) payload.stream_status = formData.stream_status;
        if (formData.selected_stream) payload.selected_stream = formData.selected_stream;

        const res = await fetch(`${API_BASE}/api/auth/signup/request-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to send OTP");
        toast.success("Verification code sent to your email");
        setStep(2);
      } else {
        const res = await fetch(`${API_BASE}/api/auth/signup/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, otp: String(otp).trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Verification failed");
        toast.success("Account created successfully! Welcome to CareerVerse");
        navigate(PathConstants.HOME);
      }
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
        body: JSON.stringify({ credential: response?.credential, mode: "signup" }),
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

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const initialEmail = params.get("email");
      if (initialEmail) {
        setFormData((prev) => ({ ...prev, email: initialEmail }));
      }
    } catch (_) { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              disabled={step === 2}
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
              placeholder="Create a password"
              required
              disabled={step === 2}
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
              disabled={step === 2}
            />
          </div>

          {/* Year Selection - Always Visible */}
          {step === 1 && (
            <div>
              <label htmlFor="class_or_year" className="block text-sm font-medium text-gray-700 mb-2">
                Your Current Year/Class
              </label>
              <select
                id="class_or_year"
                name="class_or_year"
                value={formData.class_or_year}
                onChange={(e) => {
                  handleChange(e);
                  // Auto-set education level
                  if (['9', '10', '11', '12'].includes(e.target.value)) {
                    setFormData(prev => ({ ...prev, education_level: 'School' }));
                  } else if (e.target.value.startsWith('UG') || e.target.value.startsWith('PG')) {
                    setFormData(prev => ({ ...prev, education_level: 'College' }));
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select your year...</option>
                <optgroup label="School">
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </optgroup>
                <optgroup label="Undergraduate">
                  <option value="UG Year 1">UG Year 1</option>
                  <option value="UG Year 2">UG Year 2</option>
                  <option value="UG Year 3">UG Year 3</option>
                  <option value="UG Year 4">UG Year 4</option>
                </optgroup>
                <optgroup label="Postgraduate">
                  <option value="PG Year 1">PG Year 1</option>
                  <option value="PG Year 2">PG Year 2</option>
                </optgroup>
              </select>

            </div>
          )}

          {/* Stream Selection - Always Visible */}
          {step === 1 && (
            <div>
              <label htmlFor="selected_stream" className="block text-sm font-medium text-gray-700 mb-2">
                Your Stream (If Decided)
              </label>
              <select
                id="selected_stream"
                name="selected_stream"
                value={formData.selected_stream}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) {
                    setFormData(prev => ({ ...prev, stream_status: 'Selected' }));
                  } else {
                    setFormData(prev => ({ ...prev, stream_status: 'Not Selected' }));
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Not decided yet / Need guidance</option>
                <optgroup label="School Streams">
                  <option value="Science">Science (PCM/PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts/Humanities</option>
                </optgroup>
                <optgroup label="College Domains">
                  <option value="Engineering">Engineering/Technology</option>
                  <option value="Medical">Medical/Healthcare</option>
                  <option value="Management">Management/Business</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Selecting a stream</strong> gives you personalized aptitude questions.
                <strong> Not decided?</strong> You'll get a comprehensive test to find your best fit.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter the 6-digit code"
                maxLength={6}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {step === 1 ? "Sending Code..." : "Verifying..."}
              </div>
            ) : (
              step === 1 ? "Send OTP" : "Verify OTP & Create Account"
            )}
          </button>
        </form>

        <div className="mt-4">
          <div ref={googleDivRef} className="flex justify-center" />
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
