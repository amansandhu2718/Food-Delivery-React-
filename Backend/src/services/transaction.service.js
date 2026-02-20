const db = require("../config/db");
const dashboardEvents = require("../utils/events");

exports.createTransaction = async (userId, items, promo) => {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0) + 4000;

    const { rows } = await client.query(
      `INSERT INTO transactions (user_id, total_amount, promo_used)
       VALUES ($1,$2,$3) RETURNING id`,
      [userId, total, promo]
    );

    const transactionId = rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO transaction_items
         (transaction_id, product_id, quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [transactionId, item.productId, item.quantity, item.price]
      );

      await client.query(
        `INSERT INTO product_stats (product_id, sold_count)
         VALUES ($1,$2)
         ON CONFLICT (product_id)
         DO UPDATE SET sold_count = product_stats.sold_count + $2`,
        [item.productId, item.quantity]
      );
    }

    await client.query("COMMIT");
    dashboardEvents.emit("transaction:created");
    return transactionId;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};
