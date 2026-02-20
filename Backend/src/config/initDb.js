const db = require("./db");
const bcrypt = require("bcrypt");

const initDb = async () => {
  try {
    console.log("Initializing database schema...");

    await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // --- Users table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        role TEXT DEFAULT 'USER',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // If users table existed before this change, ensure is_verified column exists
    await db.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`
    );
    await db.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_location TEXT`
    );
    await db.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_lat NUMERIC`
    );
    await db.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_long NUMERIC`
    );

    // --- Products table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        price NUMERIC NOT NULL,
        category TEXT,
        menu_category TEXT,
        image_url TEXT,
        rating NUMERIC,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Ensure new product columns exist for older databases
    await db.query(
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`
    );
    await db.query(
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC`
    );
    await db.query(
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS has_offer BOOLEAN DEFAULT FALSE`
    );
    await db.query(
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS promo TEXT`
    );

    // --- Restaurants table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        contact TEXT,
        lat NUMERIC,
        long NUMERIC,
        promo TEXT,
        image_url TEXT,
        rating NUMERIC,
        cuisine TEXT[],
        delivery_time INT,
        price_for_two NUMERIC,
        is_open BOOLEAN DEFAULT TRUE,
        is_veg BOOLEAN DEFAULT FALSE,
        has_offer BOOLEAN DEFAULT FALSE
      )
    `);

    // Ensure new restaurant columns exist for older databases
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS image_url TEXT`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS rating NUMERIC`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cuisine TEXT[]`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time INT`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS price_for_two NUMERIC`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT TRUE`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT FALSE`
    );
    await db.query(
      `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_offer BOOLEAN DEFAULT FALSE`
    );

    // --- Restaurant menu ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS restaurant_menu (
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT,
        price NUMERIC,
        PRIMARY KEY (restaurant_id, product_id)
      )
    `);

    // Ensure columns exist for older databases
    await db.query(
      `ALTER TABLE restaurant_menu ADD COLUMN IF NOT EXISTS image_url TEXT`
    );
    await db.query(
      `ALTER TABLE restaurant_menu ADD COLUMN IF NOT EXISTS price NUMERIC`
    );

    // --- Product stats ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS product_stats (
        product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
        sold_count INT DEFAULT 0
      )
    `);

    // --- Restaurant stats ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS restaurant_stats (
        restaurant_id UUID PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
        revenue NUMERIC DEFAULT 0
      )
    `);

    // --- Transactions ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        total_amount NUMERIC,
        promo_used TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- Transaction items ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS transaction_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        quantity INT,
        price NUMERIC
      )
    `);

    // --- Refresh tokens ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE,
        expires_at TIMESTAMP
      )
    `);

    // --- Email verification OTPs ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        code TEXT,
        expires_at TIMESTAMP
      )
    `);

    // --- Cart ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `);

    // --- User Addresses ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        address_line TEXT NOT NULL,
        city TEXT,
        state TEXT,
        pincode TEXT,
        lat NUMERIC,
        long NUMERIC,
        is_default BOOLEAN DEFAULT FALSE,
        label TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- Chat History ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- Complaints table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- User Favorites table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, product_id, restaurant_id)
      )
    `);

    // Migrating or ensuring restaurant_id exists for existing table
    await db.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_favorites') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_favorites' AND column_name = 'restaurant_id') THEN
            ALTER TABLE user_favorites ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
            -- We might need to drop and re-add PK if we want context. 
            -- For now let's just allow NULL if not provided? No, user wants restaurant item.
          END IF;
        END IF;
      END $$;
    `);

    // Ensure profile_image column exists
    await db.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT`
    );

    console.log("Database schema ready");

    // -----------------------------
    // Ensure at least one admin
    // -----------------------------
    const res = await db.query(`SELECT * FROM users WHERE role='ADMIN'`);
    if (res.rows.length === 0) {
      const passwordHash = await bcrypt.hash("password123", 10);
      await db.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, 'ADMIN')`,
        ["Admin User", "admin@test.com", passwordHash]
      );
      console.log("Admin created: admin@test.com / password123");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Database initialization failed", err);
    process.exit(1);
  }
};

module.exports = initDb;
