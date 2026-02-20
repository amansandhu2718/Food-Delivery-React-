const transactionService = require("../services/transaction.service");
const db = require("../config/db");

exports.createTransaction = async (req, res) => {
  const { items, promo } = req.body;
  const userId = req.user.id;

  try {
    const transactionId = await transactionService.createTransaction(
      userId,
      items,
      promo
    );

    res.status(201).json({ transactionId });
  } catch {
    res.sendStatus(500);
  }
};

// Get user's orders (transactions)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for user
    const transactionsRes = await db.query(
      `
      SELECT 
        t.id,
        t.total_amount AS "totalAmount",
        t.promo_used AS "promoUsed",
        t.created_at AS "createdAt"
      FROM transactions t
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
      `,
      [userId]
    );

    // Get items and restaurant info for each transaction
    const ordersWithItems = await Promise.all(
      transactionsRes.rows.map(async (transaction) => {
        // Get items for this transaction
        const itemsRes = await db.query(
          `
          SELECT 
            ti.id,
            ti.quantity,
            ti.price,
            p.id AS "productId",
            p.title AS "productName",
            p.image_url AS "productImage",
            p.category
          FROM transaction_items ti
          JOIN products p ON p.id = ti.product_id
          WHERE ti.transaction_id = $1
          `,
          [transaction.id]
        );

        // Get restaurant info from first item (all items should be from same restaurant)
        let restaurantInfo = null;
        if (itemsRes.rows.length > 0) {
          const restaurantRes = await db.query(
            `
            SELECT DISTINCT
              r.id AS "restaurantId",
              r.title AS "restaurantName",
              r.image_url AS "restaurantImage"
            FROM restaurants r
            INNER JOIN restaurant_menu rm ON rm.restaurant_id = r.id
            WHERE rm.product_id = $1
            LIMIT 1
            `,
            [itemsRes.rows[0].productId]
          );
          if (restaurantRes.rows.length > 0) {
            restaurantInfo = restaurantRes.rows[0];
          }
        }

        return {
          ...transaction,
          ...restaurantInfo,
          items: itemsRes.rows,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order details
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const orderRes = await db.query(
      `
      SELECT 
        t.id,
        t.total_amount AS "totalAmount",
        t.promo_used AS "promoUsed",
        t.created_at AS "createdAt",
        r.id AS "restaurantId",
        r.title AS "restaurantName",
        r.image_url AS "restaurantImage",
        r.location AS "restaurantLocation",
        r.contact AS "restaurantContact"
      FROM transactions t
      LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
      LEFT JOIN products p ON p.id = ti.product_id
      LEFT JOIN restaurant_menu rm ON rm.product_id = p.id
      LEFT JOIN restaurants r ON r.id = rm.restaurant_id
      WHERE t.id = $1 AND t.user_id = $2
      GROUP BY t.id, r.id, r.title, r.image_url, r.location, r.contact
      LIMIT 1
      `,
      [orderId, userId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    const itemsRes = await db.query(
      `
      SELECT 
        ti.id,
        ti.quantity,
        ti.price,
        p.id AS "productId",
        p.title AS "productName",
        p.image_url AS "productImage",
        p.category
      FROM transaction_items ti
      JOIN products p ON p.id = ti.product_id
      WHERE ti.transaction_id = $1
      `,
      [orderId]
    );

    res.json({
      ...order,
      items: itemsRes.rows,
    });
  } catch (err) {
    console.error("Failed to fetch order", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};
