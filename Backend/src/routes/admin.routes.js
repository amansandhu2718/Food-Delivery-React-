const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// All admin routes require authentication and ADMIN role
router.use(auth);
router.use(roleMiddleware("admin"));

router.get("/stats", adminController.getStats);

module.exports = router;
