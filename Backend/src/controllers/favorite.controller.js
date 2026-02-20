const db = require("../config/db");

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId, restaurantId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // If restaurantId is not provided, we try to find one from restaurant_menu
    let rid = restaurantId;
    if (!rid) {
      const { rows: rRows } = await db.query(
        "SELECT restaurant_id FROM restaurant_menu WHERE product_id = $1 LIMIT 1",
        [productId]
      );
      if (rRows.length > 0) {
        rid = rRows[0].restaurant_id;
      }
    }

    if (!rid) {
      return res.status(400).json({ message: "Restaurant ID is required for this product" });
    }

    // Check if already favorited
    const { rows } = await db.query(
      "SELECT * FROM user_favorites WHERE user_id = $1 AND product_id = $2 AND restaurant_id = $3",
      [userId, productId, rid]
    );

    if (rows.length > 0) {
      // Remove from favorites
      await db.query(
        "DELETE FROM user_favorites WHERE user_id = $1 AND product_id = $2 AND restaurant_id = $3",
        [userId, productId, rid]
      );
      return res.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      // Add to favorites
      await db.query(
        "INSERT INTO user_favorites (user_id, product_id, restaurant_id) VALUES ($1, $2, $3)",
        [userId, productId, rid]
      );
      return res.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (err) {
    console.error("Toggle favorite error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `SELECT p.*, 
              p.title AS name,
              COALESCE(rm.image_url, p.image_url) AS image,
              p.menu_category AS "menuCategory",
              p.has_offer AS "hasOffer",
              r.title AS "restaurantName",
              r.id AS "restaurantId",
              COALESCE(rm.price, p.price) AS price
       FROM products p
       JOIN user_favorites uf ON uf.product_id = p.id
       JOIN restaurants r ON r.id = uf.restaurant_id
       LEFT JOIN restaurant_menu rm ON rm.product_id = p.id AND rm.restaurant_id = r.id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
