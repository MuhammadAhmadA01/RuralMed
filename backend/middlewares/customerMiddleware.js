const { body, validationResult, param } = require("express-validator");
const Customer = require("../Models/Customer/Customer");
const User = require("../Models/User/User");
const viewCustomerValidationRules = [
  param("email")
    .isEmail()
    .withMessage("email param must be an email")
    .notEmpty()
    .withMessage("email param cannot be empty"),
];

const validateViewCustomerParams = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

const customerValidationRules = [
  body("cnic")
    .isNumeric()
    .withMessage("CNIC must be numeric")
    .isLength({ min: 13, max: 13 })
    .withMessage("Invalid CNIC length")
    .notEmpty()
    .withMessage("CNIC cannot be empty"),

  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email cannot be empty"),

  body("deliveryFee")
    .isNumeric()
    .withMessage("Delivery fee must be numeric")
    .custom((value) => value > 100)
    .withMessage("Delivery fee must be greater than 100")
    .notEmpty()
    .withMessage("Delivery fee cannot be empty"),
];

const validateCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => `${error.param}: ${error.msg}`);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

const orderValidationRules = [
  body("customerID")
    .isInt()
    .withMessage("CustomerID must be integer")
    .notEmpty()
    .withMessage("CustomerID cannot be empty"),
  body("riderId").isInt().notEmpty().withMessage("RiderID cannot be empty"),
  body("ownerId").isInt().notEmpty().withMessage("OwnerID cannot be empty"),
  body("shippingCharges")
    .isInt({ min: 100 })
    .withMessage("Invalid shipping charges ")
    .notEmpty()
    .withMessage("ShippingCharges cannot be empty"),
  body("orderStatus")
    .isString()
    .notEmpty()
    .withMessage("OrderStatus cannot be empty"),
  body("isPrescription")
    .isBoolean()
    .notEmpty()
    .withMessage("IsPrescription cannot be empty"),
  body("orderDetails")
    .isArray({ min: 1 })
    .withMessage("OrderDetails cannot be empty and must be an array"),

  // Validation for each object in orderDetails array
  body("orderDetails.*.prodId")
    .isInt()
    .notEmpty()
    .withMessage("ProdId in orderDetails cannot be empty"),
  body("orderDetails.*.quantity")
    .isInt()
    .notEmpty()
    .withMessage("Quantity in orderDetails cannot be empty"),
  body("orderDetails.*.subtotal")
    .isInt()
    .notEmpty()
    .withMessage("Subtotal in orderDetails cannot be empty"),
];

const validateOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

module.exports = {
  customerValidationRules,
  validateCustomer,
  orderValidationRules,
  validateOrder,
  viewCustomerValidationRules,
  validateViewCustomerParams,
};
