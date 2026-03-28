const db = require("../config/db");

exports.getAllRestaurants = async (req, res) => {
  try {
    const { lat, long } = req.query;

    let query;
    let params = [];

    let role = req.user?.role?.toUpperCase();
    let userId = req.user?.id;

    if (lat && long) {
      // Filter restaurants within 10km using Haversine formula
      query = `
        SELECT
          id, title, title AS name, COALESCE(image_url, '') AS image,
          rating, COALESCE(cuisine, '{}') AS cuisine, location,
          delivery_time AS "deliveryTime", price_for_two AS "priceForTwo",
          is_open AS "isOpen", is_veg AS "isVeg", has_offer AS "hasOffer",
          contact, promo, lat, long, owner_id,
          (
            6371 * acos(
              cos(radians($1)) * cos(radians(lat)) *
              cos(radians(long) - radians($2)) +
              sin(radians($1)) * sin(radians(lat))
            )
          ) AS distance
        FROM restaurants
        WHERE lat IS NOT NULL AND long IS NOT NULL
          AND (
            6371 * acos(
              cos(radians($1)) * cos(radians(lat)) *
              cos(radians(long) - radians($2)) +
              sin(radians($1)) * sin(radians(lat))
            )
          ) <= 10
          ${(role === "ADMIN" || role === "REST_OWNER") ? " AND owner_id = $3" : ""}
        ORDER BY distance ASC, title ASC
      `;
      params = [parseFloat(lat), parseFloat(long)];
      if (role === "ADMIN" || role === "REST_OWNER") params.push(userId);
    } else {
      query = `
        SELECT
          id, title, title AS name, COALESCE(image_url, '') AS image,
          rating, COALESCE(cuisine, '{}') AS cuisine, location,
          delivery_time AS "deliveryTime", price_for_two AS "priceForTwo",
          is_open AS "isOpen", is_veg AS "isVeg", has_offer AS "hasOffer",
          contact, promo, lat, long, owner_id
        FROM restaurants
        ${(role === "ADMIN" || role === "REST_OWNER") ? " WHERE owner_id = $1" : ""}
        ORDER BY title ASC
      `;
      if (role === "ADMIN" || role === "REST_OWNER") params = [userId];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

exports.getRestaurantById = async (req, res) => {
  const restaurantId = req.params.id;

  const { rows } = await db.query(
    `
    SELECT
      id,
      title,
      title AS name,
      COALESCE(image_url, '') AS image,
      rating,
      COALESCE(cuisine, '{}') AS cuisine,
      location,
      delivery_time AS "deliveryTime",
      price_for_two AS "priceForTwo",
      is_open AS "isOpen",
      is_veg AS "isVeg",
      has_offer AS "hasOffer",
      contact,
      promo,
      lat,
      long
    FROM restaurants
    WHERE id = $1
    `,
    [restaurantId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  res.json(rows[0]);
};

exports.createRestaurant = async (req, res) => {
  const {
    title, location, contact, lat, long, image, rating, cuisine,
    deliveryTime, priceForTwo, isOpen = true, isVeg = false,
    hasOffer = false, promo, ownerId
  } = req.body;

  const creatorRole = req.user?.role?.toUpperCase();
  const creatorId = req.user?.id;

  // If SUPER_ADMIN, use ownerId from body if provided, else use creatorId? 
  // No, if SUPER_ADMIN creates it, they might want to assign it to someone else.
  // If ADMIN or REST_OWNER, enforce creatorId as owner_id.
  const finalOwnerId = (creatorRole === "SUPER_ADMIN" && ownerId) ? ownerId : creatorId;

  const { rows } = await db.query(
    `INSERT INTO restaurants
      (title, location, contact, lat, long, image_url, rating, cuisine,
       delivery_time, price_for_two, is_open, is_veg, has_offer, promo, owner_id)
     VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
    [
      title, location, contact, lat, long, image, rating, cuisine,
      deliveryTime, priceForTwo, isOpen, isVeg, hasOffer, promo, finalOwnerId
    ]
  );

  res.status(201).json({ message: "Restaurant created", id: rows[0].id });
};

exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    location,
    contact,
    lat,
    long,
    image,
    rating,
    cuisine,
    deliveryTime,
    priceForTwo,
    isOpen,
    isVeg,
    hasOffer,
    promo,
  } = req.body;

  try {
    const { rowCount } = await db.query(
      `UPDATE restaurants SET
        title = $1, location = $2, contact = $3, lat = $4, long = $5,
        image_url = $6, rating = $7, cuisine = $8, delivery_time = $9,
        price_for_two = $10, is_open = $11, is_veg = $12, has_offer = $13,
        promo = $14
        WHERE id = $15`,
      [
        title,
        location,
        contact,
        lat,
        long,
        image,
        rating,
        cuisine,
        deliveryTime,
        priceForTwo,
        isOpen,
        isVeg,
        hasOffer,
        promo,
        id,
      ]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: "Restaurant updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update restaurant" });
  }
};

exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query("DELETE FROM restaurants WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete restaurant" });
  }
};

exports.getRestaurantMenu = async (req, res) => {
  const restaurantId = req.params.id;

  const { rows } = await db.query(
    `
      SELECT
        p.id,
        p.title AS name,
        COALESCE(rm.image_url, p.image_url, '') AS image,
        p.rating,
        p.category,
        p.menu_category AS "menuCategory",
        COALESCE(rm.price, p.price) AS price
      FROM restaurant_menu rm
      JOIN products p ON p.id = rm.product_id
      WHERE rm.restaurant_id = $1
      ORDER BY p.title ASC
    `,
    [restaurantId]
  );

  res.json(rows);
};
