const { body, validationResult } = require('express-validator');

const ownerValidationRules = [
  body('cnic').isNumeric().isLength({ min: 13, max: 13 }).notEmpty(),
  body('email').isEmail().notEmpty(),
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
