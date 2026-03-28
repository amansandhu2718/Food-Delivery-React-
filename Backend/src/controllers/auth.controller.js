const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// OTP emails are logged to server console for development/testing only

/**
 * Register a new user
 * By default, users are created with 'USER' role
 * Only admins can create users with other roles
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Default role is USER, but allow admin to set other roles
    let userRole = "USER";
    if (role) {
      // Check if caller is authenticated as ADMIN via token in header
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded && decoded.role === "SUPER_ADMIN") {
            const allowedRoles = ["USER", "ADMIN", "SUPER_ADMIN", "REST_OWNER"];
            if (allowedRoles.includes(role.toUpperCase())) {
              userRole = role.toUpperCase();
            }
          } else if (decoded && decoded.role === "ADMIN") {
            const allowedRoles = ["USER", "REST_OWNER"];
            if (allowedRoles.includes(role.toUpperCase())) {
              userRole = role.toUpperCase();
            }
          }
        } catch (err) {
          // Token invalid or expired, ignore and default to USER
        }
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hash, userRole],
    );

    const user = rows[0];

    // create OTP and send verification email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.query(
      `INSERT INTO email_verifications (user_id, code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, otp],
    );

    // Log resent OTP for debugging / dev
    try {
      console.log(`[OTP] Resent for ${user.email}: ${otp}`);
    } catch (err) {
      /* ignore */
    }

    // Log OTP server-side for debugging/testing
    try {
      console.log(`[OTP] Generated for ${user.email}: ${otp}`);
    } catch (err) {
      /* ignore logging errors */
    }

    // Log OTP to server console (do not send emails from server)
    try {
      console.log(`[OTP] (logged) for ${user.email}: ${otp}`);
    } catch (err) {
      /* ignore logging errors */
    }

    const resp = {
      message: "User created successfully",
      user,
      verificationSent: false,
    };
    if (process.env.NODE_ENV !== "production") {
      resp.otp = otp;
    }

    res.status(201).json(resp);
  } catch (e) {
    if (e.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Registration error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Verify email OTP
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log(`[OTP] Verify attempt for ${email} with code ${code}`);
    if (!email || !code)
      return res.status(400).json({ message: "Email and code required" });

    const { rows: users } = await db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });
    const userId = users[0].id;

    // Look for a matching, non-expired verification
    const { rows } = await db.query(
      `SELECT id, code, expires_at FROM email_verifications WHERE user_id = $1 AND code = $2 AND expires_at > NOW()`,
      [userId, code],
    );

    if (rows.length === 0) {
      // No valid matching code — fetch latest row (if any) to give clearer debug info in dev
      const { rows: latestRows } = await db.query(
        `SELECT id, code, expires_at FROM email_verifications WHERE user_id = $1 ORDER BY expires_at DESC LIMIT 1`,
        [userId],
      );

      if (latestRows.length === 0) {
        console.log(`[OTP] No verification record found for ${email}`);
        return res.status(400).json({ message: "Invalid or expired code" });
      }

      const latest = latestRows[0];
      const now = new Date();
      const expires = new Date(latest.expires_at);
      if (expires <= now) {
        console.log(
          `[OTP] Latest code for ${email} has expired at ${latest.expires_at}`,
        );
        return res.status(400).json({ message: "Invalid or expired code" });
      }

      // If we're here, there's a non-expired code but it didn't match what user provided
      console.log(
        `[OTP] Provided code did not match for ${email}. Latest valid code expires at ${latest.expires_at}`,
      );
      const resp = { message: "Invalid code" };
      if (process.env.NODE_ENV !== "production") {
        // Provide the latest valid code in non-production to aid debugging
        resp.latestValidCode = latest.code;
        resp.expiresAt = latest.expires_at;
      }
      return res.status(400).json(resp);
    }

    // mark user verified and remove verification
    await db.query(`UPDATE users SET is_verified = TRUE WHERE id = $1`, [
      userId,
    ]);
    await db.query(`DELETE FROM email_verifications WHERE id = $1`, [
      rows[0].id,
    ]);

    try {
      console.log(`[OTP] Verified ${email}`);
    } catch (err) {
      /* ignore */
    }
    res.json({ message: "Email verified" });
  } catch (err) {
    console.error("Verify email error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Resend verification OTP
 */
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const { rows: users } = await db.query(
      `SELECT id, is_verified FROM users WHERE email = $1`,
      [email],
    );
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });
    const user = users[0];
    if (user.is_verified)
      return res.status(400).json({ message: "Already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.query(`DELETE FROM email_verifications WHERE user_id = $1`, [
      user.id,
    ]);
    await db.query(
      `INSERT INTO email_verifications (user_id, code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, otp],
    );

    // Log OTP to server console (do not send emails from server)
    try {
      console.log(`[OTP] (resent, logged) for ${email}: ${otp}`);
    } catch (err) {
      /* ignore */
    }

    const resp = {
      message: "Verification code resent",
      verificationSent: false,
    };
    if (process.env.NODE_ENV !== "production") resp.otp = otp;
    res.json(resp);
  } catch (err) {
    console.error("Resend verification error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Login user and return JWT tokens
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact support." });
    }

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Generate refresh token (30 days)
    const refreshToken = crypto.randomBytes(40).toString("hex");

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshToken],
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      accessToken,
      // refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Refresh access token using refresh token
 */
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Find valid refresh token
    const { rows } = await db.query(
      `SELECT rt.user_id, rt.expires_at, u.name, u.email, u.role, u.is_blocked
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [refreshToken],
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { user_id, name, email, role, is_blocked } = rows[0];

    if (is_blocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user_id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({
      accessToken,
      user: {
        id: user_id,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get current authenticated user information
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, role, address, phone, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user profile (name and profile image)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    let profileImage = null;

    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    let query = "UPDATE users SET name = COALESCE($1, name)";
    let params = [name];

    if (profileImage) {
      query += ", profile_image = $2";
      params.push(profileImage);
      query += " WHERE id = $3";
      params.push(userId);
    } else {
      query += " WHERE id = $2";
      params.push(userId);
    }

    const { rows } = await db.query(
      query + " RETURNING id, name, email, role, profile_image",
      params,
    );

    res.json({
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logout user by invalidating refresh token
 */
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await db.query(`DELETE FROM refresh_tokens WHERE token = $1`, [
        refreshToken,
      ]);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all users, optionally filtered by role
 * Only for ADMIN
 */
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = "SELECT id, name, email, role, created_at, phone FROM users";
    let params = [];

    if (role) {
      query += " WHERE role = $1";
      params.push(role.toUpperCase());
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user details (for Admin)
 */
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone } = req.body;

    const { rowCount } = await db.query(
      `UPDATE users SET name = $1, email = $2, role = $3, phone = $4 WHERE id = $5`,
      [name, email, role.toUpperCase(), phone, id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Toggle user block status (for Admin/SuperAdmin)
 */
exports.toggleBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;

    const requesterRole = req.user?.role?.toUpperCase();
    if (requesterRole !== "ADMIN" && requesterRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    if (rows[0].role === "SUPER_ADMIN") {
      return res.status(403).json({ message: "Cannot block a Super Admin" });
    }

    await db.query("UPDATE users SET is_blocked = $1 WHERE id = $2", [is_blocked, id]);
    res.json({ message: `User ${is_blocked ? "blocked" : "unblocked"} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete user (for Admin/SuperAdmin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterRole = req.user?.role?.toUpperCase();
    const requesterId = req.user?.id;

    if (requesterRole !== "ADMIN" && requesterRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const targetRole = rows[0].role;

    // Constraints:
    // 1. Cannot delete self
    if (id == requesterId) return res.status(403).json({ message: "Cannot delete yourself" });
    
    // 2. Cannot delete SUPER_ADMIN
    if (targetRole === "SUPER_ADMIN") return res.status(403).json({ message: "Cannot delete Super Admin" });

    // 3. Admin cannot delete another Admin
    if (requesterRole === "ADMIN" && targetRole === "ADMIN") {
      return res.status(403).json({ message: "Admins cannot delete other Admins" });
    }

    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
