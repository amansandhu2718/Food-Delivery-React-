const router = require("express").Router();
const addressController = require("../controllers/address.controller");
const auth = require("../middlewares/auth.middleware");

// All address routes require authentication
router.get("/", auth, addressController.getAddresses);
router.post("/", auth, addressController.createAddress);
router.get("/current", auth, addressController.getCurrentLocation);
router.put("/current", auth, addressController.updateCurrentLocation);
router.put("/:addressId", auth, addressController.updateAddress);
router.delete("/:addressId", auth, addressController.deleteAddress);

module.exports = router;
