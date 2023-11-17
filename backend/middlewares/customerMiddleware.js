const { body, validationResult } = require("express-validator");

const customerValidationRules = [
  body("cnic")
    .isNumeric()
    .isLength({ min: 13, max: 13 })
    .notEmpty(),
  body("email")
    .isEmail()
    .notEmpty(),
  body("deliveryFee")
    .isNumeric()
    .custom((value) => value > 100)
    .notEmpty(),
];

const validateCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
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
  body("riderId")
    .isInt()
    .notEmpty()
    .withMessage("RiderID cannot be empty"),
  body("ownerId")
    .isInt()
    .notEmpty()
    .withMessage("OwnerID cannot be empty"),
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
};
