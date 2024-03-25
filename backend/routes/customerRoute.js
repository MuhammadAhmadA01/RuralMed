const express = require("express");
const router = express.Router();
const multer = require("multer");
const Notification = require("../Models/Notifications/Notification");
const Orders = require("../Models/Order/Order");
const product = require("../Models/Product/products");
const ratings=require('../Models/Ratings/ratings')
const customerController = require("../Controllers/Customer/customer.controller");
const Cart = require("../Models/Cart/Cart");
const {
  customerValidationRules,
  validateCustomer,
} = require("../middlewares/customerMiddleware");
router.post("/place-order", customerController.placeOrder);
router.post(
  "/customer-details",
  customerValidationRules,
  validateCustomer,
  customerController.createCustomer
);
router.post('/addRating', customerController.addRating);
router.get('/meetings', customerController.getAllMeetingsByCustomerId);
router.post("/add-to-cart", customerController.addToCart);
router.post("/book-meeting", customerController.addMeeting);
router.post('/booked-meetings',customerController.getMeetingsByDateAndDvm)
router.get(
  "/get-stores/:email",
  customerController.getNearbyStoresForCustomers
);
router.get(
  "/update-qty/:customer_contact/:productID",
  customerController.updateQuantity
);
router.delete("/delete/:customer_contact", customerController.deleteCartItem);

router.get(
  "/get-distance-of-rider/:riderEmail/:storeLat/:storeLng",
  customerController.calculateRiderDistance
);
//router.post('/create-prescription', upload.single('picture'), prescriptionsValidationRules, validatePrescriptions, customerController.createPrescription);
router.get(
  "/get-cart/:customer_contact",
  customerController.getCartByCustomerContact
);
router.get('/get-customers-orders/:id',customerController.viewOrders)

router.get('/get-customers-meetings/:id',customerController.getAllMeetingsByCustomerId)
router.get(
  "/remove-from-cart/:productID/:customerContact",
  customerController.removeFromCart
);
module.exports = router;
