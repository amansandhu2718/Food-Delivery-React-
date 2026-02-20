# Authentication & Authorization Guide

This backend implements JWT-based authentication with role-based access control (RBAC).

## Roles

The system supports three roles:

- **ADMIN** - Full system access
- **REST_OWNER** - Restaurant owners who can manage restaurants
- **USER** - Regular users who can make transactions

## Authentication Endpoints

### Register

```
POST /api/auth/register
Body: {
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" (optional, only if admin is creating user)
}
```

- Default role is `USER`
- Only admins can create users with other roles
- Returns: User object

### Login

```
POST /api/auth/login
Body: {
  "email": "string",
  "password": "string"
}
```

- Returns: `accessToken`, `refreshToken`, and `user` object

### Refresh Token

```
POST /api/auth/refresh
Body: {
  "refreshToken": "string"
}
```

- Returns: New `accessToken`

### Get Current User

```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```

- Requires authentication
- Returns: Current user information

### Logout

```
POST /api/auth/logout
Body: {
  "refreshToken": "string"
}
```

- Invalidates the refresh token

## Using JWT Tokens

Include the access token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

Access tokens expire after 15 minutes. Use the refresh token to get a new access token.

## Protected Routes

### Admin Routes (`/api/admin/*`)

- **Required Role**: `admin`
- All routes require authentication and admin role

### Product Routes (`/api/products`)

- `GET /` - Public (no authentication required)
- `GET /:productId/restaurants` - Public (no authentication required)
- `POST /` - Requires `admin` role

### Restaurant Routes (`/api/restaurants`)

- `GET /` - Public (no authentication required, supports location filtering via query params)
- `GET /:id` - Public (no authentication required)
- `GET /:id/menu` - Public (no authentication required)
- `POST /` - Requires `admin` or `rest_owner` role

### Cart Routes (`/api/cart`)

- All routes require authentication (any role)
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /item/:cartItemId` - Update cart item quantity
- `DELETE /item/:cartItemId` - Remove item from cart
- `DELETE /` - Clear entire cart

### Address Routes (`/api/addresses`)

- All routes require authentication (any role)
- `GET /` - Get all saved addresses
- `POST /` - Create new address
- `PUT /:addressId` - Update address
- `DELETE /:addressId` - Delete address
- `GET /current` - Get current location
- `PUT /current` - Update current location

### Transaction Routes (`/api/transactions`)

- `GET /` - Requires authentication (any role) - Get user's orders
- `GET /:orderId` - Requires authentication (any role) - Get single order details
- `POST /` - Requires authentication (any role) - Create new transaction/order

### Seeder Routes (`/api/admin/seeder/*`)

- **Required Role**: `admin`
- Used for database seeding and cleanup

## Middleware

### Auth Middleware

Verifies JWT token and attaches user info to `req.user`

### Role Middleware

```javascript
const roleMiddleware = require("./middlewares/role.middleware");

// Single role
router.get("/admin-only", auth, roleMiddleware("admin"), controller.action);

// Multiple roles
router.post(
  "/restaurant",
  auth,
  roleMiddleware("admin", "rest_owner"),
  controller.action
);
```

## Error Responses

- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions (wrong role)
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

## Restaurant & Food APIs (public)

### List restaurants
```
GET /api/restaurants
```
Response (200):
```json
[
  {
    "id": "uuid",
    "name": "Spice Garden",
    "image": "https://…",
    "rating": 4.4,
    "cuisine": ["North Indian", "Chinese"],
    "location": "Indiranagar, Bangalore",
    "deliveryTime": 30,
    "priceForTwo": 600,
    "isOpen": true,
    "isVeg": true,
    "hasOffer": true,
    "contact": "9991112222",
    "promo": "DUMMY_SEED"
  }
]
```

### List foods (products)
```
GET /api/products
```
Response (200):
```json
[
  {
    "id": "uuid",
    "name": "Rajma Chawal",
    "image": "https://…",
    "rating": 4.5,
    "category": "Main Course",
    "menuCategory": "main",
    "restaurantId": "uuid",
    "price": 180
  }
]
```

### Get single restaurant by ID
```
GET /api/restaurants/:id
```
Response (200):
```json
{
  "id": "uuid",
  "name": "Spice Garden",
  "image": "https://…",
  "rating": 4.4,
  "cuisine": ["North Indian", "Chinese"],
  "location": "Indiranagar, Bangalore",
  "deliveryTime": 30,
  "priceForTwo": 600,
  "isOpen": true,
  "isVeg": true,
  "hasOffer": true,
  "contact": "9991112222",
  "promo": "DUMMY_SEED"
}
```

### Get menu for a restaurant
```
GET /api/restaurants/:id/menu
```
Response (200):
```json
[
  {
    "id": "uuid",
    "name": "Rajma Chawal",
    "image": "https://…",
    "rating": 4.5,
    "category": "Main Course",
    "menuCategory": "main",
    "price": 18000
  }
]
```
**Note**: Price is in paise.

### List restaurants with location filter (2km radius)
```
GET /api/restaurants?lat=12.9716&long=77.5946
```
Query Parameters:
- `lat` (optional): Latitude of user location
- `long` (optional): Longitude of user location

If `lat` and `long` are provided, returns only restaurants within 2km radius, sorted by distance.
If not provided, returns all restaurants.

Response (200) with location:
```json
[
  {
    "id": "uuid",
    "name": "Spice Garden",
    "image": "https://…",
    "rating": 4.4,
    "cuisine": ["North Indian", "Chinese"],
    "location": "Indiranagar, Bangalore",
    "deliveryTime": 30,
    "priceForTwo": 600,
    "isOpen": true,
    "isVeg": true,
    "hasOffer": true,
    "contact": "9991112222",
    "promo": "DUMMY_SEED",
    "distance": 1.2
  }
]
```
The `distance` field (in km) is included when location parameters are provided.

### Get restaurants serving a specific product
```
GET /api/products/:productId/restaurants
```
Response (200):
```json
[
  {
    "id": "uuid",
    "name": "Spice Garden",
    "image": "https://…",
    "rating": 4.4,
    "cuisine": ["North Indian", "Chinese"],
    "location": "Indiranagar, Bangalore",
    "deliveryTime": 30,
    "priceForTwo": 600,
    "isOpen": true,
    "isVeg": true,
    "hasOffer": true,
    "contact": "9991112222"
  }
]
```
Returns all restaurants that have the specified product in their menu, sorted by rating (descending).

## Cart Endpoints

All cart endpoints require authentication.

### Get Cart
```
GET /api/cart
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```
Returns: Array of cart items with product and restaurant details

Response (200):
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "restaurantId": "uuid",
    "quantity": 2,
    "name": "Rajma Chawal",
    "price": 18000,
    "image": "https://…",
    "category": "Main Course",
    "restaurantName": "Spice Garden"
  }
]
```
**Note**: Price is in paise.

### Add to Cart
```
POST /api/cart/add
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "productId": "uuid",
  "restaurantId": "uuid",
  "quantity": 1 (optional, default: 1)
}
```
**Important**: If cart contains items from a different restaurant, all previous items are automatically cleared before adding the new item.

Response (201):
```json
{
  "message": "Item added to cart"
}
```

### Update Cart Item
```
PUT /api/cart/item/:cartItemId
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "quantity": 2
}
```

### Remove Item from Cart
```
DELETE /api/cart/item/:cartItemId
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```

### Clear Cart
```
DELETE /api/cart
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```

**Note**: Prices are stored in paise (1 Rupee = 100 paise). Convert to Rs on the client side by dividing by 100.

## Address Endpoints

All address endpoints require authentication.

### Get All Addresses
```
GET /api/addresses
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```
Returns: Array of user's saved addresses

Response (200):
```json
[
  {
    "id": "uuid",
    "addressLine": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "lat": 12.9716,
    "long": 77.5946,
    "isDefault": true,
    "label": "Home",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Address
```
POST /api/addresses
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "addressLine": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "lat": 12.9716,
  "long": 77.5946,
  "isDefault": false,
  "label": "Home"
}
```
- `addressLine` is required
- If `isDefault` is true, all other addresses are unset as default

### Update Address
```
PUT /api/addresses/:addressId
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "addressLine": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "lat": 12.9716,
  "long": 77.5946,
  "isDefault": false,
  "label": "Home"
}
```
All fields are optional. Only provided fields will be updated.

### Delete Address
```
DELETE /api/addresses/:addressId
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```

### Get Current Location
```
GET /api/addresses/current
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```
Returns: User's currently selected location

Response (200):
```json
{
  "location": "Indiranagar, Bangalore",
  "lat": 12.9716,
  "long": 77.5946
}
```

### Update Current Location
```
PUT /api/addresses/current
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "location": "Indiranagar, Bangalore",
  "lat": 12.9716,
  "long": 77.5946
}
```
Updates the user's current location for restaurant filtering.

## Transaction/Order Endpoints

All transaction endpoints require authentication.

### Get User Orders
```
GET /api/transactions
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```
Returns: Array of user's past orders with items and restaurant details

Response (200):
```json
[
  {
    "id": "uuid",
    "totalAmount": 50000,
    "promoUsed": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "restaurantId": "uuid",
    "restaurantName": "Spice Garden",
    "restaurantImage": "https://…",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "price": 18000,
        "productId": "uuid",
        "productName": "Rajma Chawal",
        "productImage": "https://…",
        "category": "Main Course"
      }
    ]
  }
]
```
**Note**: Prices are in paise.

### Get Single Order Details
```
GET /api/transactions/:orderId
Headers: {
  "Authorization": "Bearer <accessToken>"
}
```
Returns: Detailed information about a specific order

Response (200):
```json
{
  "id": "uuid",
  "totalAmount": 50000,
  "promoUsed": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "restaurantId": "uuid",
  "restaurantName": "Spice Garden",
  "restaurantImage": "https://…",
  "restaurantLocation": "Indiranagar, Bangalore",
  "restaurantContact": "9991112222",
  "items": [
    {
      "id": "uuid",
      "quantity": 2,
      "price": 18000,
      "productId": "uuid",
      "productName": "Rajma Chawal",
      "productImage": "https://…",
      "category": "Main Course"
    }
  ]
}
```
**Note**: Prices are in paise.

### Create Transaction/Order
```
POST /api/transactions
Headers: {
  "Authorization": "Bearer <accessToken>"
}
Body: {
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "price": 18000
    }
  ],
  "promo": "PROMO_CODE" (optional)
}
```
Creates a new transaction/order from cart items. Typically called after payment is processed.

Response (201):
```json
{
  "transactionId": "uuid"
}
```

**Note**: 
- Prices should be in paise
- All items in a transaction should be from the same restaurant (enforced by cart logic)
- Transaction creation updates product stats (sold_count)

## Seeder (admin only)

```
POST /api/admin/seeder/seed
POST /api/admin/seeder/cleanup
```
- Protected by `admin` role.
- `seed` populates sample restaurants, foods, and menu links.
- `cleanup` removes the seeded data.
- Prices in seeder are in paise (e.g., 18000 paise = ₹180).
