/**
 * ADMIN MODULE - Admin Authorization Middleware
 * 
 * This middleware ensures that only users with role='admin' can access admin routes.
 * Must be used AFTER authMiddleware to ensure req.user is populated.
 */

/**
 * Middleware to check if authenticated user has admin role
 * @param {Object} req - Express request object (must have req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function isAdmin(req, res, next) {
    try {
        // Check if user is authenticated (should be done by authMiddleware first)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        // User is authenticated and has admin role
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ message: "Server error during authorization" });
    }
}
