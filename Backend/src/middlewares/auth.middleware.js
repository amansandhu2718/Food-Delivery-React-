const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to verify JWT tokens
 * Extracts token from Authorization header and verifies it
 */
module.exports = (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
