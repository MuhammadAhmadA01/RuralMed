const jwt = require("jsonwebtoken");
const USER = require("../Models/User/User");
const { body, validationResult } = require("express-validator");
const loginValidationRules = [
  body("contactNumber").isLength({ min: 11, max: 11 }).isNumeric(),
  body("password").notEmpty(),
];

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
// middleware/isAuth.js

const isAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "ruralMed"); // Verify token using your secret key
    req.user = await USER.findByPk(decoded.userId); // Attach user information to the request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { loginValidationRules, validateLogin, isAuth };
