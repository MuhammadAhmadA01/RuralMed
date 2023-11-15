const { body, validationResult } = require('express-validator');

const customerValidationRules = [
  body('cnic').isNumeric().isLength({ min: 13, max: 13 }).notEmpty(),
  body('email').isEmail().notEmpty(),
  body('deliveryFee').isNumeric().custom(value => value > 100).notEmpty(),
];

const validateCustomer = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

module.exports = { customerValidationRules, validateCustomer };
