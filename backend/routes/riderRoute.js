const express = require("express");
const router = express.Router();
const riderMethods = require("../Controllers/Rider/rider.controller");
const {
  riderValidationRules,
  validateRider,
} = require("../middlewares/riderMiddleware");
router.post(
  "/create-rider",
  riderValidationRules,
  validateRider,
  riderMethods.createRider
);
router.get("/get-rider-orders/:email", riderMethods.viewOrders);
router.get("/rider-monthly-stats/:riderId", riderMethods.getRiderMonthlyStats);
router.put("/:email/:status", riderMethods.updateAvailabilityStatus);
router.get("/get-profile/:email", riderMethods.getRiderProfile);

module.exports = router;
