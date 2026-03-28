const db = require("../config/db");

exports.getAllProducts = async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      p.id,
      p.title AS name,
      COALESCE(p.image_url, '') AS image,
      p.rating,
      p.category,
      p.menu_category AS "menuCategory",
      p.price,
      p.has_offer AS "hasOffer",
      p.promo,
      (SELECT restaurant_id FROM restaurant_menu WHERE product_id = p.id LIMIT 1) AS "restaurantId"
    FROM products p
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
};

exports.createProduct = async (req, res) => {
  const { 
    title, price, category, menuCategory, rating, 
    restaurantId, hasOffer = false, promo 
  } = req.body;
  
  let imageUrl = req.body.image; // default if string provided
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const { rows } = await db.query(
    `INSERT INTO products (title, price, category, menu_category, image_url, rating, has_offer, promo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [title, price, category, menuCategory, imageUrl, rating, hasOffer === "true" || hasOffer === true, promo]
  );

  const productId = rows[0].id;

  if (restaurantId) {
    await db.query(
      `INSERT INTO restaurant_menu (restaurant_id, product_id, image_url, price) VALUES ($1, $2, $3, $4)`,
      [restaurantId, productId, imageUrl, price]
    );
  }

  res.status(201).json({ message: "Product created", productId });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, category, menuCategory, rating, hasOffer, promo, restaurantId } = req.body;
  
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const { rowCount } = await db.query(
      `UPDATE products SET
        title = $1, price = $2, category = $3, menu_category = $4,
        image_url = COALESCE($5, image_url), rating = $6, has_offer = $7, promo = $8
        WHERE id = $9`,
      [title, price, category, menuCategory, imageUrl, rating, hasOffer === "true" || hasOffer === true, promo, id]
    );

    if (imageUrl && restaurantId) {
        await db.query(
            "UPDATE restaurant_menu SET image_url = $1 WHERE product_id = $2 AND restaurant_id = $3",
            [imageUrl, id, restaurantId]
        );
    }

    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query("DELETE FROM products WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Get restaurants that have a specific product in their menu
exports.getRestaurantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const { rows } = await db.query(
      `
      SELECT DISTINCT
        r.id,
        r.title AS name,
        COALESCE(r.image_url, '') AS image,
        r.rating,
        COALESCE(r.cuisine, '{}') AS cuisine,
        r.location,
        r.delivery_time AS "deliveryTime",
        r.price_for_two AS "priceForTwo",
        r.is_open AS "isOpen",
        r.is_veg AS "isVeg",
        r.has_offer AS "hasOffer",
        r.contact
      FROM restaurants r
      INNER JOIN restaurant_menu rm ON rm.restaurant_id = r.id
      WHERE rm.product_id = $1
      ORDER BY r.rating DESC, r.title ASC
      `,
      [productId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};
