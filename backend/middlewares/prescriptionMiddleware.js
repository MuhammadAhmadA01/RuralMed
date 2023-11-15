const { body, validationResult } = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'prescriptionsImages');
  },
  filename: function (req, file, cb) {
    const fileName = req.body.customerEmail + '_' + Date.now() + getFileExtension(file.originalname);
    cb(null, fileName);
  }
});
const getFileExtension = (filename) => {
  const ext = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  return ext ? '.' + ext : '';
};
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const ext = getFileExtension(file.originalname).toLowerCase();
  const isValidFileType = allowedFileTypes.test(ext);
  if (isValidFileType) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
  }
};

const upload = multer({ storage: storage });
const prescriptionsValidationRules = [
  body('customerEmail').isEmail().notEmpty(),
  body('duration').isInt({ min: 1, max: 31 }).notEmpty(),
];
const validatePrescriptions = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Prescription image is required' });
  }

  next();
};

module.exports = { prescriptionsValidationRules, validatePrescriptions, upload };
