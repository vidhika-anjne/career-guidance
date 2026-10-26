// Temporary server for testing frontend without MySQL
// Run this with: node server-no-db.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Fix for Cross-Origin-Opener-Policy
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

console.log('⚠️  TEMPORARY SERVER - MySQL bypassed for testing');
console.log('📌 This server has limited functionality');
console.log('🎯 Use this to test frontend on port 3000');
console.log('');

// Health check
app.get('/api/health', (req, res) => {
    return res.json({ ok: true, db: false, mode: 'testing' });
});

// Config endpoint
app.get('/api/config/public', (req, res) => {
    return res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || '' });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
    return res.status(503).json({ message: 'Database not available - please fix MySQL connection' });
});

app.post('/api/auth/login', (req, res) => {
    return res.status(503).json({ message: 'Database not available - please fix MySQL connection' });
});

app.post('/api/auth/google', (req, res) => {
    return res.status(503).json({ message: 'Database not available - please fix MySQL connection' });
});

app.get('/api/auth/me', (req, res) => {
    return res.status(503).json({ message: 'Database not available - please fix MySQL connection' });
});

// Mock colleges endpoint
app.get('/api/colleges', (req, res) => {
    return res.json({ items: [] });
});

app.get('/api/colleges/near', (req, res) => {
    return res.json({ items: [] });
});

// Catch all
app.use((req, res) => {
    res.status(503).json({
        message: 'Database not available',
        hint: 'This is a temporary server. Fix MySQL password to enable full functionality.'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Temporary server listening on port ${PORT}`);
    console.log(`🌐 Frontend should connect at: ${FRONTEND_URL}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Fix MySQL password to use the real server');
    console.log('See mysql_password_reset.md for instructions');
    console.log('');
});
