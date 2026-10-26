import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";

function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const timerRef = useRef(null);
  const inactivityMs = Number(process.env.REACT_APP_INACTIVITY_TIMEOUT_MS || 300000);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
      } catch (_) { }
      navigate(PathConstants.LOGIN, { replace: true });
    }, inactivityMs);
  };
  const onActivity = () => resetTimer();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (!mounted) return;
        if (!res.ok) {
          navigate(PathConstants.LOGIN, { replace: true });
          return;
        }
        const data = await res.json();
        if (data?.user?.role !== "admin") {
          navigate(PathConstants.HOME, { replace: true });
          return;
        }
      } catch (_) {
        navigate(PathConstants.LOGIN, { replace: true });
        return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, onActivity));
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="">
      <button
        type="button"
        onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/"); }}
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/90 text-gray-700 border border-gray-200 shadow hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Go back"
      >
        ← Back
      </button>
      <Outlet />
    </main>
  );
}

export default AdminLayout;
