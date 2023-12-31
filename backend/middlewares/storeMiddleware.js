const { body, validationResult } = require("express-validator");
const storeValidationRules = [
  body("ownerEmail").isEmail().notEmpty(),
  body("storeName").isString().notEmpty(),
  body("store_address").isString().notEmpty(),
  body("storeContact")
    .isLength({ min: 11, max: 11 })
    .isNumeric()
    .custom((value) => value.startsWith("03")),
  body("storeType").isIn(["Pharmacy", "Agricultural", "Veteran"]).notEmpty(),
  body("startTime").isString().notEmpty(),
  body("endTime").isString().notEmpty(),
  body("availability").isIn(["Online", "Offline"]).notEmpty(),
];

const validateStore = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { storeValidationRules, validateStore };
