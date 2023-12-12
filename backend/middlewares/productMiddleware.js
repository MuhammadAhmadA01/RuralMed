const { body, validationResult } = require("express-validator");
const productValidationRules = [
  body("storeId")
    .isInt()
    .withMessage("Invalid store ID")
    .notEmpty()
    .withMessage("Store ID cannot be left empty"),
  body("name")
    .isString()
    .withMessage("Invalid name")
    .notEmpty()
    .withMessage("name cannot be left empty"),
  body("price")
    .isInt({ min: 1 })
    .withMessage("Invalid price")
    .notEmpty()
    .withMessage("price cannot be left empty"),
  body("description")
    .isString()
    .withMessage("Invalid description")
    .notEmpty()
    .withMessage("description cannot be left empty"),
  body("availableQuantity")
    .isInt({ min: 1 })
    .withMessage("Invalid available quantity")
    .notEmpty()
    .withMessage("Quantity cannot be left empty"),
];

const validateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => `${error.msg}`);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

module.exports = { productValidationRules, validateProduct };
