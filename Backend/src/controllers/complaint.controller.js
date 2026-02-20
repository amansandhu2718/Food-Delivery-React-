const db = require("../config/db");
const dashboardEvents = require("../utils/events");

exports.createComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const { rows } = await db.query(
      `INSERT INTO complaints (user_id, subject, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, subject, message]
    );

    // Emit event for real-time dashboard update
    dashboardEvents.emit("complaint:created");

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: rows[0],
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, u.name as user_name, u.email as user_email
       FROM complaints c
       JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
