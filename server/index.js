import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import { ensureDatabase } from "./db/pool.js";

const PORT = process.env.PORT || 5000;

// Initialize database and start server
ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Auth server listening on port ${PORT}`);
      console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });
