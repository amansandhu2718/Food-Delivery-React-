const router = require("express").Router();
const complaintController = require("../controllers/complaint.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, complaintController.createComplaint);
router.get("/", auth, complaintController.getComplaints);

module.exports = router;
