CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  role TEXT DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT,
  menu_category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  contact TEXT,
  lat NUMERIC,
  long NUMERIC,
  promo TEXT
);

CREATE TABLE restaurant_menu (
  restaurant_id UUID REFERENCES restaurants(id),
  product_id UUID REFERENCES products(id),
  PRIMARY KEY (restaurant_id, product_id)
);

CREATE TABLE product_stats (
  product_id UUID PRIMARY KEY REFERENCES products(id),
  sold_count INT DEFAULT 0
);

CREATE TABLE restaurant_stats (
  restaurant_id UUID PRIMARY KEY REFERENCES restaurants(id),
  revenue NUMERIC DEFAULT 0
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total_amount NUMERIC,
  promo_used TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  product_id UUID REFERENCES products(id),
  quantity INT,
  price NUMERIC
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  token TEXT UNIQUE,
  expires_at TIMESTAMP
);
