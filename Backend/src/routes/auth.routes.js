const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-otp", authController.resendVerification);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", auth, authController.getCurrentUser);
router.get("/users", auth, authController.getUsers);
router.put("/users/:id", auth, authController.updateUserByAdmin);
router.put("/profile", auth, upload.single("image"), authController.updateProfile);

module.exports = router;
