const { body, validationResult } = require("express-validator");
const prescriptionsValidationRules = [
  body("customerEmail").isEmail().notEmpty(),
  body("duration").isInt({ min: 1, max: 31 }).notEmpty(),
];
const validatePrescriptions = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Prescription image is required" });
  }

  next();
};

module.exports = {
  prescriptionsValidationRules,
  validatePrescriptions,
};
