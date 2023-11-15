const { validationResult, body } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: 'profileImages',
  filename: (req, file, cb) => {
    // Use email as the filename, assuming it's available in the request body
    const email = req.body.email;
    const ext = path.extname(file.originalname);
    cb(null, `${email}${ext}`);
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowed = allowedFileTypes.test(ext);
    if (isAllowed) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
  },
}).single('picture'); // Assuming the field name for the image is 'picture'

const signupValidationRules = [
  body('firstName').isAlpha().notEmpty(),
  body('lastName').isAlpha().notEmpty(),
  body('email').isEmail().notEmpty(),
  body('password').notEmpty(),
  body('contactNumber').isLength({ min: 11, max: 11 }).isNumeric(),
  body('address').notEmpty(),
  body('cityNearBy').isAlpha().notEmpty(),
  body('role').isIn(['Customer', 'Rider', 'Owner', 'DVM']).notEmpty(),
];

const validateSignup = (req, res, next) => {
  // Handle image upload using Multer
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Image upload error' });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Validate other request body fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, delete the uploaded file and return errors
      if (req.file) {
        const filePath = path.join('profileImages', req.file.filename);
        fs.unlinkSync(filePath);
      }
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    next();
  });
};

module.exports = { signupValidationRules, validateSignup };
