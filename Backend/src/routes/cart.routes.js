const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../middlewares/auth.middleware");

// All cart routes require authentication
router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addToCart);
router.put("/item/:cartItemId", auth, cartController.updateCartItem);
router.delete("/item/:cartItemId", auth, cartController.removeFromCart);
router.delete("/", auth, cartController.clearCart);

module.exports = router;

