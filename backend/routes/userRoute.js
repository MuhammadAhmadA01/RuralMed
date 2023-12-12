const express = require("express");
const router = express.Router();
const Prescription = require("../Models/Prescription/prescription");
const {
  signupValidationRules,
  validateSignup,
  validatingSignupDataRules,
  validateSignupValidations,
} = require("../middlewares/signupMiddleWare");
const userMethods = require("../Controllers/User/User.controller");
const {
  loginValidationRules,
  validateLogin,
} = require("../middlewares/loginMiddleware");
const { uploads } = require("../multer/multer");
const { isAuth } = require("../middlewares/loginMiddleware");
router.post(
  "/login",
  loginValidationRules,
  validateLogin,
  userMethods.loginController
);
router.post(
  "/signup",
  signupValidationRules,
  validateSignup,
  userMethods.signupController
);
router.post(
  "/validate-user-data",
  validatingSignupDataRules,
  validateSignupValidations,
  userMethods.validateUserDataController
);
router.get("/verify-token", isAuth, (req, res) => {
  // Access the authenticated user using req.user
  res.json({
    message: "You have access to this protected route",
    success: true,
  });
});
router.post("/notifications", userMethods.createNotification);
router.get("/notifications/:email/:role", userMethods.getNotifications);
router.put(
  "/update-notifications/:email/:role",
  userMethods.updateNotifications
);

router.post("/upload", uploads.single("profile"), userMethods.uploadProfile);
router.post(
  "/upload-pres",
  uploads.single("profile"),
  userMethods.uploadPrescription
);
router.get("/product/:productID", userMethods.getProductById);

router.put(
  "/notifications/:notificationID/:role",
  userMethods.updateNotificationStatus
);
router.get("/order/:orderID", userMethods.getOrderById);

router.post("/get-email", userMethods.getUserEmailByContactNumber);
router.get("/get-user-profile/:userEmail", userMethods.getUserProfile);

module.exports = router;
