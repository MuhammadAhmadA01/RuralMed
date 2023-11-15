const { body, validationResult } = require('express-validator');
const storeValidationRules = [
    body('ownerEmail').isEmail().notEmpty(),
    body('storeName').isString().notEmpty(),
    body('storeAddress').isString().notEmpty(),
    body('storeContact').isLength({ min: 11, max: 11 }).isNumeric().custom(value => value.startsWith('03')),
    body('storeType').isIn(['Pharmacy', 'Agricultural', 'Veteran']).notEmpty(),
    body('startTime').isString().notEmpty().custom((value, { req }) => {
      const startTime = req.body.startTime.toLowerCase();
      const endTime = req.body.endTime.toLowerCase();
      return (
        (startTime.includes('am') && endTime.includes('pm')) ||
        (startTime.includes('pm') && endTime.includes('pm') && startTime < endTime) ||
        (startTime.includes('am') && endTime.includes('am') && startTime < endTime)
      );
    }),
    body('endTime').isString().notEmpty(),
    body('availability').isIn(['Online', 'Offline']).notEmpty(),
  ];
  


const validateStore = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { storeValidationRules, validateStore };
