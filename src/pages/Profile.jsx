import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [pass, setPass] = useState({ current: "", next: "", confirm: "" });
  const [changingPass, setChangingPass] = useState(false);
  const [msg, setMsg] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setNameInput(data.user?.name || "");
        } else {
          setUser(null);
        }
      } catch (_) {
        setUser(null);
      }
      try {
        const pr = await fetch(`${API_BASE}/api/user/profile`, { credentials: "include" });
        if (pr.ok) {
          const data = await pr.json();
          setProfile(data.profile || {});
        }
      } catch (_) { }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" })
      .catch(() => { })
      .finally(() => navigate(PathConstants.ABOUT));
  };

  const saveName = async () => {
    try {
      setMsg(null);
      setSavingName(true);
      const res = await fetch(`${API_BASE}/api/user/name`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setMsg({ type: "success", text: "Name updated" });
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "error", text: e.message || "Failed to update name" });
      }
    } finally {
      setSavingName(false);
    }
  };

  const saveProfile = async () => {
    try {
      setMsg(null);
      setSavingProfile(true);
      const body = {
        age: profile?.age ? Number(profile.age) : null,
        gender: profile?.gender ?? null,
        class_level: profile?.class_level ?? null,
        location: profile?.location ?? null,
        phone: profile?.phone ?? null,
        address: profile?.address ?? null,
      };
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || {});
        setMsg({ type: "success", text: "Profile updated" });
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "error", text: e.message || "Failed to update profile" });
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (!pass.next || pass.next.length < 6) {
      setMsg({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    if (pass.next !== pass.confirm) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    try {
      setMsg(null);
      setChangingPass(true);
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pass.current, newPassword: pass.next }),
      });
      if (res.ok) {
        setPass({ current: "", next: "", confirm: "" });
        setMsg({ type: "success", text: "Password changed" });
      } else {
        const e = await res.json().catch(() => ({}));
        setMsg({ type: "error", text: e.message || "Failed to change password" });
      }
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>
        {msg && (
          <div className={`${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"} px-4 py-2 rounded mb-4`}>
            {msg.text}
          </div>
        )}
        {loading ? (
          <div className="text-gray-600 text-center">Loading...</div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Name</div>
                <div className="flex gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Your name"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="text-lg font-medium break-all">{user.email}</div>
              </div>

              <div className="space-y-3">
                <div className="text-lg font-semibold text-gray-800">Additional Information</div>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="number"
                    value={profile?.age || ""}
                    onChange={(e) => setProfile({ ...(profile || {}), age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Age"
                  />
                  <select
                    value={profile?.class_level || ""}
                    onChange={(e) => setProfile({ ...(profile || {}), class_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Class</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="graduate">Graduate</option>
                  </select>
                  <input
                    type="text"
                    value={profile?.location || ""}
                    onChange={(e) => setProfile({ ...(profile || {}), location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Location (City, State)"
                  />
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    Save Info
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-semibold text-gray-800">Change Password</div>
              <input
                type="password"
                value={pass.current}
                onChange={(e) => setPass({ ...pass, current: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Current password"
              />
              <input
                type="password"
                value={pass.next}
                onChange={(e) => setPass({ ...pass, next: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="New password"
              />
              <input
                type="password"
                value={pass.confirm}
                onChange={(e) => setPass({ ...pass, confirm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Confirm new password"
              />
              <button
                onClick={changePassword}
                disabled={changingPass}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60"
              >
                Update Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-gray-600">No user session found.</div>
            <button
              onClick={() => navigate(PathConstants.ABOUT)}
              className="w-full max-w-sm mx-auto bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
