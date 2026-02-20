const router = require("express").Router();
const productController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Public route - anyone can view products
router.get("/", productController.getAllProducts);
router.get(
  "/:productId/restaurants",
  productController.getRestaurantsByProduct,
);

// Protected routes - only admins
router.post(
  "/",
  auth,
  roleMiddleware("admin"),
  upload.single("image"),
  productController.createProduct,
);
router.put(
  "/:id",
  auth,
  roleMiddleware("admin"),
  upload.single("image"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  auth,
  roleMiddleware("admin"),
  productController.deleteProduct,
);

module.exports = router;
