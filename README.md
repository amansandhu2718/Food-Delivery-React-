# 🍔 Food Delivery App

A scalable, full-stack food delivery platform that seamlessly connects hungry users with their favorite local restaurants. 

## ✨ Key Features
* **Secure Authentication:** User signup, login, and email verification using JWT and Bcrypt.
* **Dynamic Menu & Restaurants:** Browse live restaurants, filter by categories, read ratings, and view offers.
* **Shopping Cart & Checkout:** Add items to your cart and process transactions securely.
* **Real-time Chat:** Communicate directly within the app regarding your orders.
* **User Profiles:** Manage multiple delivery addresses, save favorite restaurants and products, and view transaction history.
* **Robust Backend:** Powered by a Node.js/Express API with a highly structured PostgreSQL database schema.

## 🛠️ Tech Stack
* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (with `uuid-ossp` integration)
* **Authentication:** JSON Web Tokens (JWT)

Screenshots:

![Image](https://github.com/user-attachments/assets/d5b283e1-dea0-401a-8f61-478262305881)

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
