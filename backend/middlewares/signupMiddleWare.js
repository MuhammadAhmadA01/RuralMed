const { validationResult, body } = require("express-validator");

const signupValidationRules = [
  body("firstName")
    .isAlpha()
    .withMessage("Names should be alphabetic")
    .notEmpty()
    .withMessage("Names should not be empty"),
  body("lastName")
    .isAlpha()
    .withMessage("Names should be alphabetic")
    .notEmpty()
    .withMessage("Names should not be empty"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email should not be empty"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be of atleast length 8")
    .notEmpty()
    .withMessage("Password should not be empty"),
  body("contactNumber").isLength({ min: 11, max: 11 }).isNumeric(),
  body("address").notEmpty().withMessage("Address must not be empty"),
  body("cityNearBy")
    .isAlpha()
    .withMessage("City must be alphabetic")
    .notEmpty()
    .withMessage("City should not be empty"),
  body("role")
    .isIn(["Customer", "Rider", "Owner", "DVM"])
    .notEmpty()
    .withMessage("Must define a role"),
];
const validatingSignupDataRules = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email should not be empty"),
  body("contactNumber").isLength({ min: 11, max: 11 }).isNumeric(),
];
const validateSignupValidations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = {
  signupValidationRules,
  validateSignup,
  validatingSignupDataRules,
  validateSignupValidations,
};
