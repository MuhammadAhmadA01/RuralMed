const User = require("../../Models/User/User");
const bcrypt = require("bcrypt");
const cloudinary=require('../../config/cloudinary')
const loginController = (req, res) => {
  const { contactNumber, password } = req.body;

  User.findOne({ where: { contactNumber } })
    .then((user) => {
      if (!user) {
        throw { status: 400, message: "Invalid credentials" };
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isPasswordValid) => {
      if (!isPasswordValid) {
        throw { status: 400, message: "Invalid credentials" };
      }

      return res.status(200).json({ message: "Login successful" });
    })
    .catch((error) => {
      console.error("Error while login:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};

const signupController = (req, res) => {
  // Extract user data from request body
  const {
    firstName,
    lastName,
    email,
    password,
    contactNumber,
    address,
    cityNearBy,
    role,
  } = req.body;

  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        throw { status: 400, message: "Email is already in use" };
      }

      return User.findOne({ where: { contactNumber } });
    })
    .then((existingContact) => {
      if (existingContact) {
        throw { status: 400, message: "Contact number is already in use" };
      }

      // Hash the password
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      // Create a new user
      return User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        address,
        cityNearBy,
        role,
        picture:"0"
      });
    })
    .then((newUser) => {
      console.log(newUser)
      res.status(201).json({success:true, newUser});
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const uploadProfile = (req, res) => {
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: `${req.body.email}`,
      width: 500,
      height: 500,
      crop: 'fill',
    })
    .then((result) => {
      // Update user with the profile picture URL
      return User.update(
        { picture: result.secure_url },
        {
          where: {
            email: req.body.email,
          },
        }
      );
    })
    .then(() => {
      // The user has been successfully updated
      res.status(200).json({ success: true, message: 'Profile picture uploaded successfully' });
    })
    .catch((err) => {
      // Handle any errors that occurred during the process
      console.log('Error while updating profile picture', err);
      res.status(500).json({ success: false, message: 'Server error, try after some time' });
    });
};

module.exports = { signupController, loginController,uploadProfile };
