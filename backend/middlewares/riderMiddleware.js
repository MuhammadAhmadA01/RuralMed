const { body, validationResult } = require("express-validator");

const riderValidationRules = [
  body("cnic")
    .isNumeric()
    .withMessage("Cnic must be numeric")
    .isLength({ min: 13, max: 13 })
    .withMessage("Cnic must be of length 13")
    .notEmpty()
    .withMessage("Cnic should not be empty"),
  body("deliveryFee")
    .isNumeric()
    .withMessage("Delivery fee must be numeric")
    .custom((value) => value >= 100)
    .withMessage("Delivery fee must be more than or equal to 100")
    .notEmpty()
    .withMessage("Delivery fee should not be empty"),
  body("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email must not be empty"),
  body("availabilityStatus")
    .isIn(["Online", "Offline"])
    .notEmpty()
    .withMessage("Must select availability status"),
];
const validateRider = (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = { riderValidationRules, validateRider };
