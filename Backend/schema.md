users [icon: user]{
  id UUID PK
  name TEXT
  email TEXT
  password TEXT
  address TEXT
  phone TEXT
  role TEXT
  is_verified BOOLEAN
  current_location TEXT
  current_lat NUMERIC
  current_long NUMERIC
  addresses UUID[]
  current_address_id UUID
  profile_image TEXT
  created_at TIMESTAMP
}

refresh_tokens [icon: key]{
  id UUID PK
  user_id UUID
  token TEXT
  expires_at TIMESTAMP
}

email_verifications [icon: mail]{
  id UUID PK
  user_id UUID
  code TEXT
  expires_at TIMESTAMP
}

user_addresses [icon: map-pin]{
  id UUID PK
  user_id UUID
  address_line TEXT
  city TEXT
  state TEXT
  pincode TEXT
  lat NUMERIC
  long NUMERIC
  is_default BOOLEAN
  label TEXT
  created_at TIMESTAMP
}

products [icon: package]{
  id UUID PK
  title TEXT
  subtitle TEXT
  description TEXT
  price NUMERIC
  category TEXT
  menu_category TEXT
  image_url TEXT
  rating NUMERIC
  has_offer BOOLEAN
  promo TEXT
  created_at TIMESTAMP
}

restaurants [icon: home]{
  id UUID PK
  title TEXT
  description TEXT
  location TEXT
  contact TEXT
  lat NUMERIC
  long NUMERIC
  promo TEXT
  image_url TEXT
  rating NUMERIC
  cuisine TEXT[]
  delivery_time INT
  price_for_two NUMERIC
  is_open BOOLEAN
  is_veg BOOLEAN
  has_offer BOOLEAN
}

restaurant_menu [icon: list]{
  restaurant_id UUID PK
  product_id UUID PK
  image_url TEXT
  price NUMERIC
}

product_stats [icon: chart-bar]{
  product_id UUID PK
  sold_count INT
}

restaurant_stats [icon: chart-bar]{
  restaurant_id UUID PK
  revenue NUMERIC
}

transactions [icon: credit-card]{
  id UUID PK
  user_id UUID
  total_amount NUMERIC
  promo_used TEXT
  created_at TIMESTAMP
}

transaction_items [icon: shopping-cart]{
  id UUID PK
  transaction_id UUID
  product_id UUID
  quantity INT
  price NUMERIC
}

cart [icon: shopping-bag]{
  id UUID PK
  user_id UUID
  product_id UUID
  restaurant_id UUID
  quantity INT
  created_at TIMESTAMP
}

chat_history [icon: message-circle]{
  id UUID PK
  user_id UUID
  sender TEXT
  content TEXT
  created_at TIMESTAMP
}

complaints [icon: alert-triangle]{
  id UUID PK
  user_id UUID
  subject TEXT
  message TEXT
  status TEXT
  created_at TIMESTAMP
}

user_favorites [icon: heart]{
  user_id UUID PK
  product_id UUID PK
  restaurant_id UUID PK
  created_at TIMESTAMP
}


users.id < transactions.user_id
users.id < refresh_tokens.user_id
users.id < email_verifications.user_id
users.id < user_addresses.user_id
users.id < cart.user_id
users.id < chat_history.user_id
users.id < complaints.user_id
users.id < user_favorites.user_id

user_addresses.id - users.current_address_id

products.id < restaurant_menu.product_id
products.id - product_stats.product_id
products.id < transaction_items.product_id
products.id < cart.product_id
products.id < user_favorites.product_id

restaurants.id < restaurant_menu.restaurant_id
restaurants.id - restaurant_stats.restaurant_id
restaurants.id < cart.restaurant_id
restaurants.id < user_favorites.restaurant_id

transactions.id < transaction_items.transaction_id

---

# API Endpoints Documentation

## 1. Auth Endpoints
### `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "USER" // Optional
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "USER", "created_at": "timestamp" },
    "verificationSent": false
  }
  ```

### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "jwt_token_here",
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "USER" }
  }
  ```

### `POST /api/auth/verify-email`
- **Request Body:** `{ "email": "john@example.com", "code": "123456" }`
- **Response:** `{ "message": "Email verified" }`

### `POST /api/auth/resend-otp`
- **Request Body:** `{ "email": "john@example.com" }`
- **Response:** `{ "message": "Verification code resent", "verificationSent": false }`

### `POST /api/auth/refresh`
- **Request:** Cookie `refreshToken=...`
- **Response:** `{ "accessToken": "new_jwt_here", "user": { ... } }`

### `POST /api/auth/logout`
- **Request:** Cookie `refreshToken=...`
- **Response:** `{ "message": "Logged out successfully" }`

### `GET /api/auth/me` (Protected)
- **Response:** 
  ```json
  {
    "user": {
      "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "USER", "address": "...", "phone": "...", "created_at": "timestamp"
    }
  }
  ```

## 2. Product Endpoints
### `GET /api/products`
- **Response:** Complete list of products.
  ```json
  [
    { "id": "uuid", "name": "Pizza", "image": "/uploads/...", "rating": 4.5, "category": "Food", "menuCategory": "Main", "price": 12.99, "hasOffer": true, "promo": "20% OFF" }
  ]
  ```

### `GET /api/products/:productId/restaurants`
- **Response:** Restaurants offering this product.
  ```json
  [
    { "id": "uuid", "name": "Pasta House", "image": "/uploads/...", "rating": 4.8, "cuisine": ["Italian"], "location": "123 Main St", "deliveryTime": 30, "priceForTwo": 40, "isOpen": true, "isVeg": false, "hasOffer": false, "contact": "1234567890" }
  ]
  ```

## 3. Restaurant Endpoints
### `GET /api/restaurants`
- **Query Params (Optional):** `?lat=...&long=...` (for 2km radius search)
- **Response:** List of restaurants. `distance` is included if lat/long provided.

### `GET /api/restaurants/:id`
- **Response:** Single restaurant details object.

### `GET /api/restaurants/:id/menu`
- **Response:** List of products in the restaurant's menu.
  ```json
  [
    { "id": "uuid", "name": "Pizza", "image": "/uploads/...", "rating": 4.5, "category": "Food", "menuCategory": "Main", "price": 12.99 }
  ]
  ```

## 4. Cart Endpoints (Protected)
### `GET /api/cart`
- **Response:** User's cart items.
  ```json
  [
    { "id": "uuid", "productId": "uuid", "restaurantId": "uuid", "quantity": 2, "name": "Pizza", "price": 12.99, "image": "/uploads/...", "category": "Food", "restaurantName": "Pizza Place" }
  ]
  ```

### `POST /api/cart/add`
- **Request Body:** `{ "productId": "uuid", "restaurantId": "uuid", "quantity": 1 }`
- **Response:** `{ "message": "Item added to cart" }`

### `PUT /api/cart/item/:cartItemId`
- **Request Body:** `{ "quantity": 3 }`
- **Response:** `{ "message": "Cart item updated" }`

### `DELETE /api/cart/item/:cartItemId`
- **Response:** `{ "message": "Item removed from cart" }`

### `DELETE /api/cart`
- **Response:** `{ "message": "Cart cleared" }`

## 5. Transaction Endpoints (Protected)
### `POST /api/transactions`
- **Request Body:**
  ```json
  {
    "items": [ { "productId": "uuid", "quantity": 2, "price": 12.99 } ],
    "promo": "SAVE20"
  }
  ```
- **Response:** `{ "transactionId": "uuid" }`

### `GET /api/transactions`
- **Response:** List of user's orders, including items and restaurant info for each.

### `GET /api/transactions/:orderId`
- **Response:** Specific order details.

## 6. Address Endpoints (Protected)
### `GET /api/addresses`
- **Response:** User's saved addresses.

### `POST /api/addresses`
- **Request Body:** `{ "addressLine": "123 Main St", "city": "NY", "state": "NY", "pincode": "10001", "lat": 40.71, "long": -74.00, "isDefault": true, "label": "Home" }`
- **Response:** Created address object.

### `GET /api/addresses/current`
- **Response:** Result containing the customized or default current location in `{ location, lat, long, currentAddressId, ... }` format.

### `PUT /api/addresses/current`
- **Request Body:** Either `{ "addressId": "uuid" }` OR custom `{ "location": "...", "lat": 40.7, "long": -74.0 }`
- **Response:** `{ "message": "Location updated" }`

## 7. Favorite Endpoints (Protected)
### `POST /api/favorites/toggle`
- **Request Body:** `{ "productId": "uuid", "restaurantId": "uuid" }` *(restaurantId optional if deducible)*
- **Response:** `{ "message": "Added to favorites", "isFavorite": true }`

### `GET /api/favorites`
- **Response:** List of favorited products detailing the product and restaurant names.

## 8. Complaint Endpoints (Protected)
### `POST /api/complaints`
- **Request Body:** `{ "subject": "Late delivery", "message": "The order was 30 mins late." }`
- **Response:** `{ "message": "Complaint submitted successfully", "complaint": { ... } }`
