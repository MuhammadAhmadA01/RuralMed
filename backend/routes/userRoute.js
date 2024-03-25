const express = require("express");
const router = express.Router();
const Prescription = require("../Models/Prescription/prescription");
const Meeting=require('../Models/Meeting/Meeting')
const DVM=require('../Models/DVM/DVM')
const Meeting_Notification=require('../Models/Notifications/Meeting_Notifications')
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
router.post('/get-options', (req, res) => {
  const { userMessage } = req.body;
  // Basic example: Return options based on user's message
  const options = userMessage === 'How are you?' ? ['Good', 'Bad'] : [];
  res.json(options);
});
router.post("/upload", uploads.single("profile"), userMethods.uploadProfile);

router.post("/upload-payment", uploads.single("profile"), userMethods.uploadPayment);
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
router.post('/verify', userMethods.sendOTP);

// Route to verify OTP
router.post('/verify-otp', userMethods.verifyOTP);
router.post('/update', userMethods.updateUserFieldController);
router.post('/get-count-of-orders',userMethods.getOrderCounts)
router.post('/update-location',userMethods.updateUserAddress)
router.get('/get-meeting-by-id/:meetingID',userMethods.getMeetingById)
router.post('/send-email-order',userMethods.sendOrderEmail)
router.post('/send-email-meeting',userMethods.sendMeetingEmail)

module.exports = router;
