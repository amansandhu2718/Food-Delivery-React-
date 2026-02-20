/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Check if user has one of the allowed roles
    const userRole = req.user.role?.toUpperCase();
    const allowed = allowedRoles.map(role => role.toUpperCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ 
        message: "Forbidden: Insufficient permissions",
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

