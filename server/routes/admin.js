/**
 * ADMIN MODULE - Admin Routes
 * 
 * Protected routes for admin-only operations including:
 * - Dashboard statistics
 * - User management (list, view, delete, promote)
 * - College management (CRUD operations)
 * - Test monitoring
 * 
 * All routes require authentication (authMiddleware) and admin role (isAdmin)
 */

import express from "express";
import { getPool } from "../db/pool.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Apply admin middleware to all routes in this router
router.use(isAdmin);

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

/**
 * GET /api/admin/dashboard
 * Get comprehensive dashboard statistics
 */
router.get("/dashboard", async (req, res) => {
    try {
        const pool = getPool();

        // Total users
        const [totalUsers] = await pool.query("SELECT COUNT(*) as count FROM users");

        // User profiles by category (from user_profiles table)
        const [usersByCategory] = await pool.query(`
      SELECT 
        class_level,
        COUNT(*) as count
      FROM user_profiles
      WHERE class_level IS NOT NULL
      GROUP BY class_level
    `);

        // Stream distribution from test results
        const [streamDistribution] = await pool.query(`
      SELECT 
        JSON_EXTRACT(top_streams, '$[0].stream') as top_stream,
        COUNT(*) as count
      FROM career_test_results
      WHERE top_streams IS NOT NULL
      GROUP BY top_stream
    `);

        // Total colleges
        const [totalColleges] = await pool.query("SELECT COUNT(*) as count FROM colleges");

        // Total test attempts
        const [totalTests] = await pool.query(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
      FROM career_test_sessions
    `);

        // Format category data
        const categoryStats = {
            school: 0,
            college: 0,
            professional: 0
        };

        usersByCategory.forEach(row => {
            const category = row.class_level?.toLowerCase() || '';
            if (category.includes('class') || category.includes('school')) {
                categoryStats.school += row.count;
            } else if (category.includes('college') || category.includes('undergraduate') || category.includes('graduate')) {
                categoryStats.college += row.count;
            } else if (category.includes('professional') || category.includes('working')) {
                categoryStats.professional += row.count;
            }
        });

        // Format stream data
        const streamStats = {};
        streamDistribution.forEach(row => {
            const stream = row.top_stream?.replace(/"/g, '') || 'unknown';
            streamStats[stream] = row.count;
        });

        return res.json({
            totalUsers: totalUsers[0].count,
            usersByCategory: categoryStats,
            streamDistribution: streamStats,
            totalColleges: totalColleges[0].count,
            testStats: {
                totalAttempts: totalTests[0].total_attempts || 0,
                completed: totalTests[0].completed || 0,
                inProgress: totalTests[0].in_progress || 0
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
});

// =====================================================
// USER MANAGEMENT
// =====================================================

/**
 * GET /api/admin/users
 * List all users with optional search and pagination
 * Query params: search, page, limit
 */
router.get("/users", async (req, res) => {
    try {
        const pool = getPool();
        const { search = '', page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.provider,
        u.role,
        u.created_at,
        p.class_level,
        p.location,
        p.interests,
        p.phone
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE 1=1
    `;

        const params = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
        params.push(Number(limit), offset);

        const [users] = await pool.query(query, params);

        // Get count for pagination
        let countQuery = `SELECT COUNT(*) as total FROM users u WHERE 1=1`;
        const countParams = [];

        if (search) {
            countQuery += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const [countResult] = await pool.query(countQuery, countParams);

        // Get test completion status for each user
        for (let user of users) {
            const [testStatus] = await pool.query(
                `SELECT COUNT(*) as completed FROM career_test_sessions WHERE user_id = ? AND status = 'completed'`,
                [user.id]
            );
            user.testsCompleted = testStatus[0].completed;
        }

        return res.json({
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / Number(limit))
            }
        });

    } catch (error) {
        console.error('List users error:', error);
        return res.status(500).json({ message: "Error fetching users" });
    }
});

/**
 * GET /api/admin/user/:id
 * Get detailed information about a specific user
 */
router.get("/user/:id", async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        const [users] = await pool.query(
            `SELECT 
        u.id, u.name, u.email, u.provider, u.role, u.created_at, u.updated_at,
        p.age, p.gender, p.class_level, p.location, p.interests, p.phone, p.address
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ?`,
            [id]
        );

        if (!users[0]) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get test history
        const [tests] = await pool.query(
            `SELECT 
        s.id, s.category, s.status, s.start_time, s.completion_time,
        r.stream_scores, r.top_streams, r.confidence_level
      FROM career_test_sessions s
      LEFT JOIN career_test_results r ON s.id = r.session_id
      WHERE s.user_id = ?
      ORDER BY s.start_time DESC`,
            [id]
        );

        // Get events
        const [events] = await pool.query(
            `SELECT id, title, event_date, type, priority FROM events WHERE user_id = ? ORDER BY event_date DESC LIMIT 10`,
            [id]
        );

        return res.json({
            user: users[0],
            tests,
            events
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
});

/**
 * DELETE /api/admin/user/:id
 * Delete a user and all related records (cascades automatically via FK constraints)
 */
router.delete("/user/:id", async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        // Prevent self-deletion
        if (Number(id) === req.user.id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        // Check if user exists
        const [users] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
        if (!users[0]) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user (cascades to user_profiles, events, test_sessions, etc.)
        await pool.query("DELETE FROM users WHERE id = ?", [id]);

        return res.json({
            success: true,
            message: `User ${users[0].name} (${users[0].email}) deleted successfully`
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: "Error deleting user" });
    }
});

/**
 * PUT /api/admin/user/:id/promote
 * Promote a user to admin role
 */
router.put("/user/:id/promote", async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        // Check if user exists
        const [users] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
        if (!users[0]) {
            return res.status(404).json({ message: "User not found" });
        }

        if (users[0].role === 'admin') {
            return res.status(400).json({ message: "User is already an admin" });
        }

        // Promote to admin
        await pool.query("UPDATE users SET role = 'admin' WHERE id = ?", [id]);

        return res.json({
            success: true,
            message: `User ${users[0].name} promoted to admin`
        });

    } catch (error) {
        console.error('Promote user error:', error);
        return res.status(500).json({ message: "Error promoting user" });
    }
});

// =====================================================
// COLLEGE MANAGEMENT
// =====================================================

/**
 * GET /api/admin/colleges
 * List all colleges with optional search and filtering
 */
router.get("/colleges", async (req, res) => {
    try {
        const pool = getPool();
        const { search = '', type = '', state = '', page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = `SELECT * FROM colleges WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (name LIKE ? OR city LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (type) {
            query += ` AND type = ?`;
            params.push(type);
        }

        if (state) {
            query += ` AND state = ?`;
            params.push(state);
        }

        query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
        params.push(Number(limit), offset);

        const [colleges] = await pool.query(query, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM colleges WHERE 1=1`;
        const countParams = [];

        if (search) {
            countQuery += ` AND (name LIKE ? OR city LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`);
        }
        if (type) {
            countQuery += ` AND type = ?`;
            countParams.push(type);
        }
        if (state) {
            countQuery += ` AND state = ?`;
            countParams.push(state);
        }

        const [countResult] = await pool.query(countQuery, countParams);

        return res.json({
            colleges,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / Number(limit))
            }
        });

    } catch (error) {
        console.error('List colleges error:', error);
        return res.status(500).json({ message: "Error fetching colleges" });
    }
});

/**
 * POST /api/admin/college
 * Add a new college
 */
router.post("/college", async (req, res) => {
    try {
        const pool = getPool();
        const {
            name, state, city, type, ownership = 'government',
            description, website, latitude, longitude, ranking,
            fees_min, fees_max, exams, courses, accreditation, email, phone, paths
        } = req.body;

        // Validate required fields
        if (!name || !state || !city || !type) {
            return res.status(400).json({ message: "Name, state, city, and type are required" });
        }

        // Validate type enum
        const validTypes = ['technology', 'commerce', 'arts', 'design', 'science', 'medical'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
        }

        const [result] = await pool.query(
            `INSERT INTO colleges (
        name, state, city, type, ownership, description, website,
        latitude, longitude, ranking, fees_min, fees_max,
        exams, courses, accreditation, email, phone, paths
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, state, city, type, ownership, description, website,
                latitude, longitude, ranking, fees_min, fees_max,
                exams ? JSON.stringify(exams) : null,
                courses ? JSON.stringify(courses) : null,
                accreditation, email, phone,
                paths ? JSON.stringify(paths) : null
            ]
        );

        return res.status(201).json({
            success: true,
            id: result.insertId,
            message: "College added successfully"
        });

    } catch (error) {
        console.error('Add college error:', error);
        return res.status(500).json({ message: "Error adding college" });
    }
});

/**
 * PUT /api/admin/college/:id
 * Update an existing college
 */
router.put("/college/:id", async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;
        const {
            name, state, city, type, ownership,
            description, website, latitude, longitude, ranking,
            fees_min, fees_max, exams, courses, accreditation, email, phone, paths
        } = req.body;

        // Check if college exists
        const [existing] = await pool.query("SELECT id FROM colleges WHERE id = ?", [id]);
        if (!existing[0]) {
            return res.status(404).json({ message: "College not found" });
        }

        // Build dynamic update query
        const updates = [];
        const params = [];

        if (name !== undefined) { updates.push('name = ?'); params.push(name); }
        if (state !== undefined) { updates.push('state = ?'); params.push(state); }
        if (city !== undefined) { updates.push('city = ?'); params.push(city); }
        if (type !== undefined) { updates.push('type = ?'); params.push(type); }
        if (ownership !== undefined) { updates.push('ownership = ?'); params.push(ownership); }
        if (description !== undefined) { updates.push('description = ?'); params.push(description); }
        if (website !== undefined) { updates.push('website = ?'); params.push(website); }
        if (latitude !== undefined) { updates.push('latitude = ?'); params.push(latitude); }
        if (longitude !== undefined) { updates.push('longitude = ?'); params.push(longitude); }
        if (ranking !== undefined) { updates.push('ranking = ?'); params.push(ranking); }
        if (fees_min !== undefined) { updates.push('fees_min = ?'); params.push(fees_min); }
        if (fees_max !== undefined) { updates.push('fees_max = ?'); params.push(fees_max); }
        if (exams !== undefined) { updates.push('exams = ?'); params.push(JSON.stringify(exams)); }
        if (courses !== undefined) { updates.push('courses = ?'); params.push(JSON.stringify(courses)); }
        if (accreditation !== undefined) { updates.push('accreditation = ?'); params.push(accreditation); }
        if (email !== undefined) { updates.push('email = ?'); params.push(email); }
        if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
        if (paths !== undefined) { updates.push('paths = ?'); params.push(JSON.stringify(paths)); }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        params.push(id);
        await pool.query(
            `UPDATE colleges SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        return res.json({ success: true, message: "College updated successfully" });

    } catch (error) {
        console.error('Update college error:', error);
        return res.status(500).json({ message: "Error updating college" });
    }
});

/**
 * DELETE /api/admin/college/:id
 * Delete a college
 */
router.delete("/college/:id", async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        // Check if college exists
        const [colleges] = await pool.query("SELECT id, name FROM colleges WHERE id = ?", [id]);
        if (!colleges[0]) {
            return res.status(404).json({ message: "College not found" });
        }

        await pool.query("DELETE FROM colleges WHERE id = ?", [id]);

        return res.json({
            success: true,
            message: `College "${colleges[0].name}" deleted successfully`
        });

    } catch (error) {
        console.error('Delete college error:', error);
        return res.status(500).json({ message: "Error deleting college" });
    }
});

// =====================================================
// TEST MONITORING
// =====================================================

/**
 * GET /api/admin/tests
 * View all test sessions with results
 */
router.get("/tests", async (req, res) => {
    try {
        const pool = getPool();
        const { category = '', status = '', page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = `
      SELECT 
        s.id, s.user_id, s.category, s.status, s.start_time, s.completion_time,
        u.name as user_name, u.email as user_email,
        r.stream_scores, r.top_streams, r.confidence_level, r.completion_percentage
      FROM career_test_sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN career_test_results r ON s.id = r.session_id
      WHERE 1=1
    `;
        const params = [];

        if (category) {
            query += ` AND s.category = ?`;
            params.push(category);
        }

        if (status) {
            query += ` AND s.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY s.start_time DESC LIMIT ? OFFSET ?`;
        params.push(Number(limit), offset);

        const [tests] = await pool.query(query, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM career_test_sessions s WHERE 1=1`;
        const countParams = [];

        if (category) {
            countQuery += ` AND s.category = ?`;
            countParams.push(category);
        }
        if (status) {
            countQuery += ` AND s.status = ?`;
            countParams.push(status);
        }

        const [countResult] = await pool.query(countQuery, countParams);

        return res.json({
            tests,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / Number(limit))
            }
        });

    } catch (error) {
        console.error('List tests error:', error);
        return res.status(500).json({ message: "Error fetching tests" });
    }
});

/**
 * GET /api/admin/tests/stats
 * Get test statistics and trends
 */
router.get("/tests/stats", async (req, res) => {
    try {
        const pool = getPool();

        // Overall stats
        const [overall] = await pool.query(`
      SELECT 
        category,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) as abandoned
      FROM career_test_sessions
      GROUP BY category
    `);

        // Stream recommendation distribution
        const [streamDist] = await pool.query(`
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(top_streams, '$[0].stream')) as recommended_stream,
        COUNT(*) as count
      FROM career_test_results
      WHERE top_streams IS NOT NULL
      GROUP BY recommended_stream
    `);

        // Confidence level distribution
        const [confidenceDist] = await pool.query(`
      SELECT 
        confidence_level,
        COUNT(*) as count
      FROM career_test_results
      GROUP BY confidence_level
    `);

        return res.json({
            byCategory: overall,
            streamDistribution: streamDist,
            confidenceDistribution: confidenceDist
        });

    } catch (error) {
        console.error('Test stats error:', error);
        return res.status(500).json({ message: "Error fetching test statistics" });
    }
});

export default router;
