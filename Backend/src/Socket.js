const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const { chatWithGemini } = require("./services/gemini.service");
const dashboardEvents = require("./utils/events");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Access token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role }

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Invalid or expired token"));
    }
  });

  const getDashboardData = async () => {
    try {
      // 1. Stats
      const statsRes = await db.query(`
        SELECT 
          ROUND(COALESCE(SUM(total_amount), 0) / 100.0, 2) as "totalSales",
          COUNT(*) as "totalOrders",
          (SELECT COUNT(*) FROM users WHERE role = 'USER') as "totalCustomers",
          (SELECT COUNT(*) FROM users) as "totalUsers"
        FROM transactions
      `);

      // 2. Weekly Revenue for Line Chart
      const lineDataRes = await db.query(`
        SELECT 
          TO_CHAR(created_at, 'Dy') as x,
          ROUND(SUM(total_amount) / 100.0, 2) as y
        FROM transactions
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY TO_CHAR(created_at, 'Dy'), DATE_TRUNC('day', created_at)
        ORDER BY DATE_TRUNC('day', created_at)
      `);

      // 3. Category Breakdown for Pie Chart
      const pieDataRes = await db.query(`
        SELECT 
          p.title as id,
          p.title as label,
          SUM(ti.quantity) as value
        FROM transaction_items ti
        JOIN products p ON p.id = ti.product_id
        GROUP BY p.id, p.title
        ORDER BY value DESC
        LIMIT 10
      `);

      // 4. Bar Chart Data (Orders by Category)
      const barDataRes = await db.query(`
        SELECT 
          p.category as "category",
          COUNT(*) as "orders"
        FROM transaction_items ti
        JOIN products p ON p.id = ti.product_id
        GROUP BY p.category
        LIMIT 6
      `);

      // 5. Recent Transactions
      const recentRes = await db.query(`
        SELECT 
          t.id as txId,
          u.name as user,
          ROUND(t.total_amount / 100.0, 2) as cost,
          TO_CHAR(t.created_at, 'YYYY-MM-DD') as date
        FROM transactions t
        JOIN users u ON u.id = t.user_id
        ORDER BY t.created_at DESC
        LIMIT 10
      `);

      // 6. Recent Complaints
      const complaintsRes = await db.query(`
        SELECT 
          c.id as txId,
          u.name as user,
          c.subject as cost,
          TO_CHAR(c.created_at, 'YYYY-MM-DD') as date
        FROM complaints c
        JOIN users u ON u.id = c.user_id
        ORDER BY c.created_at DESC
        LIMIT 10
      `);

      return {
        stats: statsRes.rows[0],
        lineData: [{ id: "Revenue", data: lineDataRes.rows }],
        pieData: pieDataRes.rows,
        barData: barDataRes.rows,
        recentTransactions: recentRes.rows,
        recentComplaints: complaintsRes.rows
      };
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      return null;
    }
  };

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.user.id);
    const userId = socket.user.id;

    // Load chat history
    try {
      const { rows } = await db.query(
        `SELECT sender, content, created_at FROM chat_history 
         WHERE user_id = $1 
         ORDER BY created_at ASC`,
        [userId]
      );
      
      socket.emit("chat:history", rows);
    } catch (err) {
      console.error("Error loading chat history:", err);
    }

    socket.on("chat:message", async (message) => {
      console.log(`Message from ${userId}:`, message);

      try {
        await db.query(
          `INSERT INTO chat_history (user_id, sender, content) VALUES ($1, 'user', $2)`,
          [userId, message]
        );

        const { rows: history } = await db.query(
          `SELECT sender, content FROM chat_history 
           WHERE user_id = $1 
           ORDER BY created_at ASC`,
          [userId]
        );

        const aiResponse = await chatWithGemini(userId, message, history.slice(0, -1));

        await db.query(
          `INSERT INTO chat_history (user_id, sender, content) VALUES ($1, 'ai', $2)`,
          [userId, aiResponse]
        );

        socket.emit("chat:reply", { content: aiResponse });

      } catch (err) {
        console.error("Chat error:", err);
        socket.emit("chat:reply", {
          content: "Sorry, I encountered an error processing your request.",
        });
      }
    });

    if (socket.user.role.toUpperCase() === "ADMIN") {
      socket.join("dashboard:admin");
      const data = await getDashboardData();
      if (data) socket.emit("dashboard:stats", data);

      const interval = setInterval(async () => {
        const data = await getDashboardData();
        if (data) socket.emit("dashboard:stats", data);
      }, 60000); // Periodic fallback every 60s
      
      socket.on("disconnect", () => clearInterval(interval));
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });

  // Global listener for real-time updates
  const updateDashboards = async () => {
    console.log("Real-time data update triggered...");
    const data = await getDashboardData();
    if (data) {
      io.to("dashboard:admin").emit("dashboard:stats", data);
    }
  };

  dashboardEvents.on("transaction:created", updateDashboards);
  dashboardEvents.on("complaint:created", updateDashboards);
};

module.exports = { initSocket };
