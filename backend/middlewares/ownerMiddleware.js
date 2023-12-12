const { body, validationResult } = require("express-validator");

const ownerValidationRules = [
  body("cnic")
    .isNumeric()
    .withMessage("Cnic must be numeric")
    .isLength({ min: 13, max: 13 })
    .withMessage("Cnic must be of length 13")
    .notEmpty()
    .withMessage("Cnic should not be empty"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email must not be empty"),
];
const validateOwner = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = { ownerValidationRules, validateOwner };
