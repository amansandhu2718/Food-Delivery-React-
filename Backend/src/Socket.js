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

  const getDashboardData = async (ownerId = null) => {
    try {
      let restaurantId = null;
      if (ownerId) {
        const res = await db.query("SELECT id FROM restaurants WHERE owner_id = $1", [ownerId]);
        if (res.rows.length > 0) restaurantId = res.rows[0].id;
      }

      // 1. Stats
      const statsQuery = ownerId && restaurantId 
        ? `SELECT 
            ROUND(COALESCE(SUM(t.total_amount), 0) / 100.0, 2) as "totalSales",
            COUNT(DISTINCT t.id) as "totalOrders",
            (SELECT COUNT(DISTINCT user_id) FROM transactions WHERE id IN (SELECT transaction_id FROM transaction_items ti JOIN products p ON p.id = ti.product_id JOIN restaurant_menu rm ON rm.product_id = p.id WHERE rm.restaurant_id = $1)) as "totalCustomers",
            0 as "totalUsers"
           FROM transactions t
           JOIN transaction_items ti ON ti.transaction_id = t.id
           JOIN products p ON p.id = ti.product_id
           JOIN restaurant_menu rm ON rm.product_id = p.id
           WHERE rm.restaurant_id = $1`
        : `SELECT 
            ROUND(COALESCE(SUM(total_amount), 0) / 100.0, 2) as "totalSales",
            COUNT(*) as "totalOrders",
            (SELECT COUNT(*) FROM users WHERE role = 'USER') as "totalCustomers",
            (SELECT COUNT(*) FROM users) as "totalUsers"
           FROM transactions`;
      
      const statsRes = await db.query(statsQuery, ownerId && restaurantId ? [restaurantId] : []);

      // 2. Weekly Revenue
      const lineQuery = ownerId && restaurantId
        ? `SELECT TO_CHAR(t.created_at, 'Dy') as x, ROUND(SUM(ti.price * ti.quantity) / 100.0, 2) as y
           FROM transactions t
           JOIN transaction_items ti ON ti.transaction_id = t.id
           JOIN products p ON p.id = ti.product_id
           JOIN restaurant_menu rm ON rm.product_id = p.id
           WHERE rm.restaurant_id = $1 AND t.created_at > NOW() - INTERVAL '7 days'
           GROUP BY TO_CHAR(t.created_at, 'Dy'), DATE_TRUNC('day', t.created_at)
           ORDER BY DATE_TRUNC('day', t.created_at)`
        : `SELECT TO_CHAR(created_at, 'Dy') as x, ROUND(SUM(total_amount) / 100.0, 2) as y
           FROM transactions
           WHERE created_at > NOW() - INTERVAL '7 days'
           GROUP BY TO_CHAR(created_at, 'Dy'), DATE_TRUNC('day', created_at)
           ORDER BY DATE_TRUNC('day', created_at)`;

      const lineDataRes = await db.query(lineQuery, ownerId && restaurantId ? [restaurantId] : []);

      // 3. Pie Chart
      const pieQuery = ownerId && restaurantId
        ? `SELECT p.title as id, p.title as label, SUM(ti.quantity) as value
           FROM transaction_items ti
           JOIN products p ON p.id = ti.product_id
           JOIN restaurant_menu rm ON rm.product_id = p.id
           WHERE rm.restaurant_id = $1
           GROUP BY p.id, p.title ORDER BY value DESC LIMIT 10`
        : `SELECT p.title as id, p.title as label, SUM(ti.quantity) as value
           FROM transaction_items ti
           JOIN products p ON p.id = ti.product_id
           GROUP BY p.id, p.title ORDER BY value DESC LIMIT 10`;

      const pieDataRes = await db.query(pieQuery, ownerId && restaurantId ? [restaurantId] : []);

      // 4. Bar Chart
      const barQuery = ownerId && restaurantId
        ? `SELECT p.category as "category", COUNT(*) as "orders"
           FROM transaction_items ti
           JOIN products p ON p.id = ti.product_id
           JOIN restaurant_menu rm ON rm.product_id = p.id
           WHERE rm.restaurant_id = $1
           GROUP BY p.category LIMIT 6`
        : `SELECT p.category as "category", COUNT(*) as "orders"
           FROM transaction_items ti
           JOIN products p ON p.id = ti.product_id
           GROUP BY p.category LIMIT 6`;

      const barDataRes = await db.query(barQuery, ownerId && restaurantId ? [restaurantId] : []);

      // 5. Recent Transactions
      const recentQuery = ownerId && restaurantId
        ? `SELECT t.id as txId, u.name as user, ROUND(SUM(ti.price * ti.quantity) / 100.0, 2) as cost, TO_CHAR(t.created_at, 'YYYY-MM-DD') as date
           FROM transactions t
           JOIN users u ON u.id = t.user_id
           JOIN transaction_items ti ON ti.transaction_id = t.id
           JOIN products p ON p.id = ti.product_id
           JOIN restaurant_menu rm ON rm.product_id = p.id
           WHERE rm.restaurant_id = $1
           GROUP BY t.id, u.name, t.created_at ORDER BY t.created_at DESC LIMIT 10`
        : `SELECT t.id as txId, u.name as user, ROUND(t.total_amount / 100.0, 2) as cost, TO_CHAR(t.created_at, 'YYYY-MM-DD') as date
           FROM transactions t
           JOIN users u ON u.id = t.user_id
           ORDER BY t.created_at DESC LIMIT 10`;

      const recentRes = await db.query(recentQuery, ownerId && restaurantId ? [restaurantId] : []);

      // 6. Complaints
      const complaintsRes = ownerId ? { rows: [] } : await db.query(`
        SELECT c.id as txId, u.name as user, c.subject as cost, TO_CHAR(c.created_at, 'YYYY-MM-DD') as date
        FROM complaints c JOIN users u ON u.id = c.user_id
        ORDER BY c.created_at DESC LIMIT 10
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

    const role = socket.user.role?.toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "REST_OWNER") {
      const room = role === "REST_OWNER" ? `dashboard:owner:${userId}` : "dashboard:admin";
      socket.join(room);
      
      const data = await getDashboardData(role === "REST_OWNER" ? userId : null);
      if (data) socket.emit("dashboard:stats", data);

      const interval = setInterval(async () => {
        const data = await getDashboardData(role === "REST_OWNER" ? userId : null);
        if (data) socket.emit("dashboard:stats", data);
      }, 60000);
      
      socket.on("disconnect", () => clearInterval(interval));
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });

  // Global listener for real-time updates
  const updateDashboards = async () => {
    console.log("Real-time data update triggered...");
    
    // Update global admins
    const globalData = await getDashboardData();
    if (globalData) {
      io.to("dashboard:admin").emit("dashboard:stats", globalData);
    }

    // Note: To be fully efficient, we could find which restaurant the event belongs to
    // and only update that room. For now, this is a reasonable starting point.
  };

  dashboardEvents.on("transaction:created", updateDashboards);
  dashboardEvents.on("complaint:created", updateDashboards);
};

module.exports = { initSocket };
