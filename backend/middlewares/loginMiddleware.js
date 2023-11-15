const { body, validationResult } = require('express-validator');
const loginValidationRules = [
  body('contactNumber').isLength({ min: 11, max: 11 }).isNumeric(),
  body('password').notEmpty(),
];

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { loginValidationRules, validateLogin };
