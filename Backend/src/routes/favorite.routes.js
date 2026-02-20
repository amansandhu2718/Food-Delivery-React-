const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", auth, favoriteController.getFavorites);
router.post("/toggle", auth, favoriteController.toggleFavorite);

module.exports = router;
