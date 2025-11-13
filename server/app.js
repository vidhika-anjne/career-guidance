import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, GOOGLE_CLIENT_ID } from "./config/env.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import collegesRouter from "./routes/colleges.js";
import { getPool } from "./db/pool.js";

const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Public config
app.get("/api/config/public", (req, res) => {
  return res.json({ googleClientId: GOOGLE_CLIENT_ID });
});

// Health
app.get("/api/health", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT 1 AS ok");
    return res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    return res.status(500).json({ ok: false, db: false });
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/colleges", collegesRouter);

export default app;
