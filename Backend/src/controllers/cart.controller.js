const db = require("../config/db");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `SELECT 
        c.id,
        c.product_id AS "productId",
        c.restaurant_id AS "restaurantId",
        c.quantity,
        p.title AS name,
        p.price,
        p.image_url AS image,
        p.category,
        r.title AS "restaurantName"
      FROM cart c
      JOIN products p ON p.id = c.product_id
      JOIN restaurants r ON r.id = c.restaurant_id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add item to cart (clears previous restaurant items if different restaurant)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, restaurantId, quantity = 1 } = req.body;

    if (!productId || !restaurantId) {
      return res.status(400).json({ message: "productId and restaurantId are required" });
    }

    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      // Check if cart has items from a different restaurant
      const existingCart = await client.query(
        `SELECT DISTINCT restaurant_id FROM cart WHERE user_id = $1`,
        [userId]
      );

      if (existingCart.rows.length > 0) {
        const existingRestaurantId = existingCart.rows[0].restaurant_id;
        if (existingRestaurantId !== restaurantId) {
          // Clear cart items from previous restaurant
          await client.query(
            `DELETE FROM cart WHERE user_id = $1`,
            [userId]
          );
        }
      }

      // Insert or update cart item
      await client.query(
        `INSERT INTO cart (user_id, product_id, restaurant_id, quantity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart.quantity + $4`,
        [userId, productId, restaurantId, quantity]
      );

      await client.query("COMMIT");

      res.status(201).json({ message: "Item added to cart" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    await db.query(
      `UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3`,
      [quantity, cartItemId, userId]
    );

    res.json({ message: "Cart item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    await db.query(
      `DELETE FROM cart WHERE id = $1 AND user_id = $2`,
      [cartItemId, userId]
    );

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

