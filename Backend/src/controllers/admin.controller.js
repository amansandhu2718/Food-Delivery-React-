const db = require("../config/db");

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
