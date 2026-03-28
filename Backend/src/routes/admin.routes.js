const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const superAdminMiddleware = require("../middlewares/superadmin.middleware");

// All admin routes require authentication
router.use(auth);

// Base admin stats (Admins & Super Admins)
router.get("/stats", adminMiddleware, adminController.getStats);

// Dangerous System Operations (Super Admins ONLY)
router.post("/reset-system", superAdminMiddleware, adminController.resetSystem);
router.post("/seed-demo", superAdminMiddleware, adminController.seedDemoData);

module.exports = router;
