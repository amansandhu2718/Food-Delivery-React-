const db = require("../config/db");
const { seedDummyData } = require("../utils/dbSeeder");

exports.getStats = async (req, res) => {
  const revenue = await db.query("SELECT SUM(total_amount) FROM transactions");

  const topProducts = await db.query(
    `SELECT p.title, ps.sold_count
     FROM product_stats ps
     JOIN products p ON p.id = ps.product_id
     ORDER BY ps.sold_count DESC
     LIMIT 5`
  );

  res.json({
    revenue: revenue.rows[0].sum || 0,
    topProducts: topProducts.rows,
  });
};

/**
 * RESET SYSTEM DATA (Super Admin only)
 * Truncates all operational tables and removes all users except the caller.
 */
exports.resetSystem = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const userId = req.user.id;
    await client.query("BEGIN");

    // Order matters due to FK constraints
    const tables = [
      "transaction_items", "transactions", "cart",
      "restaurant_menu", "restaurant_stats", "product_stats",
      "user_favorites", "complaints", "chat_history", "email_verifications",
      "refresh_tokens", "user_addresses", "products", "restaurants"
    ];

    for (const table of tables) {
      await client.query(`TRUNCATE TABLE ${table} CASCADE`);
    }

    // Delete all users EXCEPT the currently logged in super admin
    await client.query(`DELETE FROM users WHERE id != $1`, [userId]);

    await client.query("COMMIT");
    res.json({ message: "System reset successfully. All data wiped except your account." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("System reset failed", err);
    res.status(500).json({ message: "System reset failed", error: err.message });
  } finally {
    client.release();
  }
};

/**
 * SEED DEMO DATA (Super Admin only)
 * Triggers the legacy dummy data seeder script.
 */
exports.seedDemoData = async (req, res) => {
  try {
    await seedDummyData();
    res.json({ message: "Demo data seeded successfully. Ready for demonstration." });
  } catch (err) {
    console.error("Demo seeding failed", err);
    res.status(500).json({ message: "Demo seeding failed", error: err.message });
  }
};
