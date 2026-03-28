const db = require("../config/db");

// Get all addresses for user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await db.query(
      `SELECT 
        id,
        address_line AS "addressLine",
        city,
        state,
        pincode,
        lat,
        long,
        is_default AS "isDefault",
        label,
        created_at AS "createdAt"
      FROM user_addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC`,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressLine, city, state, pincode, lat, long, isDefault, label } =
      req.body;

    if (!addressLine) {
      return res.status(400).json({ message: "addressLine is required" });
    }

    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      // If this is set as default, unset other defaults
      if (isDefault) {
        await client.query(
          `UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1`,
          [userId],
        );
      }

      const result = await client.query(
        `INSERT INTO user_addresses 
          (user_id, address_line, city, state, pincode, lat, long, is_default, label)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING 
          id,
          address_line AS "addressLine",
          city,
          state,
          pincode,
          lat,
          long,
          is_default AS "isDefault",
          label`,
        [
          userId,
          addressLine,
          city,
          state,
          pincode,
          lat,
          long,
          isDefault || false,
          label,
        ],
      );

      await client.query("COMMIT");

      // Update user's addresses array
      await db.query(
        `UPDATE users SET addresses = array_append(addresses, $1) WHERE id = $2`,
        [result.rows[0].id, userId],
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { addressLine, city, state, pincode, lat, long, isDefault, label } =
      req.body;

    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      // If this is set as default, unset other defaults
      if (isDefault) {
        await client.query(
          `UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1 AND id != $2`,
          [userId, addressId],
        );
      }

      const result = await client.query(
        `UPDATE user_addresses 
         SET address_line = COALESCE($1, address_line),
             city = COALESCE($2, city),
             state = COALESCE($3, state),
             pincode = COALESCE($4, pincode),
             lat = COALESCE($5, lat),
             long = COALESCE($6, long),
             is_default = COALESCE($7, is_default),
             label = COALESCE($8, label)
         WHERE id = $9 AND user_id = $10
         RETURNING 
          id,
          address_line AS "addressLine",
          city,
          state,
          pincode,
          lat,
          long,
          is_default AS "isDefault",
          label`,
        [
          addressLine,
          city,
          state,
          pincode,
          lat,
          long,
          isDefault,
          label,
          addressId,
          userId,
        ],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Address not found" });
      }

      await client.query("COMMIT");
      res.json(result.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    await db.query(
      `DELETE FROM user_addresses WHERE id = $1 AND user_id = $2`,
      [addressId, userId],
    );

    // Remove from user's addresses array and unset current if it was this address
    await db.query(
      `UPDATE users 
       SET addresses = array_remove(addresses, $1),
           current_address_id = CASE WHEN current_address_id = $1 THEN NULL ELSE current_address_id END
       WHERE id = $2`,
      [addressId, userId],
    );

    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

// Update user's current location
exports.updateCurrentLocation = async (req, res) => {
  try {
    console.log("Updating current location for user:", req.user, req.body);
    const userId = req.user.id;
    const { addressId, location, lat, long } = req.body;

    if (addressId) {
      // Set current address ID and sync ALL coordinates/details
      await db.query(
        `UPDATE users 
         SET current_address_id = $1, 
             current_location = (SELECT address_line FROM user_addresses WHERE id = $1 AND user_id = $2),
             current_lat = (SELECT lat FROM user_addresses WHERE id = $1 AND user_id = $2),
             current_long = (SELECT long FROM user_addresses WHERE id = $1 AND user_id = $2)
         WHERE id = $2`,
        [addressId, userId],
      );
    } else {
      // Custom location (e.g. current GPS)
      await db.query(
        `UPDATE users 
         SET current_location = $1, 
             current_lat = $2, 
             current_long = $3, 
             current_address_id = NULL
         WHERE id = $4`,
        [location, lat, long, userId],
      );
    }

    res.json({ message: "Location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// Get user's current location
exports.getCurrentLocation = async (req, res) => {
  try {
    // console.log("Fetching current location for user:", req.user);
    const userId = req.user.id;

    const { rows } = await db.query(
      `SELECT 
        COALESCE(ua.address_line, u.current_location) AS location, 
        COALESCE(ua.lat, u.current_lat) AS lat, 
        COALESCE(ua.long, u.current_long) AS long,
        u.current_address_id AS "currentAddressId",
        ua.id,
        COALESCE(ua.address_line, u.current_location) AS "addressLine",
        ua.city,
        ua.state,
        ua.pincode,
        ua.lat AS "addressLat",
        ua.long AS "addressLong",
        ua.is_default AS "isDefault",
        ua.label,
        CASE WHEN ua.id IS NOT NULL THEN 'joined_address' ELSE 'user_cache' END AS "data_source_debug"
       FROM users u
       LEFT JOIN user_addresses ua ON u.current_address_id = ua.id
       WHERE u.id = $1`,
      [userId],
    );

    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};
