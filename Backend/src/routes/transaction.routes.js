const router = require("express").Router();
const transactionController = require("../controllers/transaction.controller");
const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// All transaction routes require authentication
router.use(auth);

// Users can create transactions (all authenticated users)
router.post("/", roleMiddleware("user", "admin", "rest_owner"), transactionController.createTransaction);

// Get user's orders
router.get("/", transactionController.getUserOrders);

// Get single order by ID
router.get("/:orderId", transactionController.getOrderById);

module.exports = router;
