const router = require("express").Router();
const seederController = require("../controllers/seeder.controller");
const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Both routes are protected: only admin can run
router.post("/seed", auth, roleMiddleware("admin"), seederController.seed);
router.post("/cleanup", auth, roleMiddleware("admin"), seederController.cleanup);

module.exports = router;
