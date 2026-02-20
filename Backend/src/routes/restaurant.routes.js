const router = require("express").Router();
const restaurantController = require("../controllers/restaurant.controller");
const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Public routes - anyone can view restaurants
router.get("/:id/menu", restaurantController.getRestaurantMenu);
router.get("/:id", restaurantController.getRestaurantById);
router.get("/", restaurantController.getAllRestaurants);

// Protected routes - admins and restaurant owners
router.post("/", auth, roleMiddleware("admin", "rest_owner"), restaurantController.createRestaurant);
router.put("/:id", auth, roleMiddleware("admin", "rest_owner"), restaurantController.updateRestaurant);
router.delete("/:id", auth, roleMiddleware("admin", "rest_owner"), restaurantController.deleteRestaurant);

module.exports = router;
