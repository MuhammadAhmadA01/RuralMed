const { body,validationResult } = require('express-validator');

const riderValidationRules = [
  body('cnic').isNumeric().isLength({ min: 13, max: 13 }).notEmpty(),
  body('deliveryFee').isNumeric().custom(value => value >= 100).notEmpty(),
  body('email').isEmail().notEmpty(),
  body('availabilityStatus').isIn(['Online', 'Offline']).notEmpty(),
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
  

module.exports = { riderValidationRules,validateRider };