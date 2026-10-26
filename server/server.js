import dotenv from "dotenv";
dotenv.config();

import { ensureDatabase } from "./db/pool.js";
import express from "express";

const app = express();

// ensure DB
await ensureDatabase();

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// start server ONCE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
