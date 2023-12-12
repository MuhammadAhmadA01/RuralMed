const { Op } = require("sequelize");
const Product = require("../../Models/Product/products");
const Prescription = require("../../Models/Prescription/prescription");
const User = require("../../Models/User/User");
const jwt = require("jsonwebtoken");
const Notifications = require("../../Models/Notifications/Notification");
const bcrypt = require("bcrypt");
const cloudinary = require("../../config/cloudinary");
const Order = require("../../Models/Order/Order");
const loginController = (req, res) => {
  const { contactNumber, password } = req.body;

  User.findOne({ where: { contactNumber } })
    .then((user) => {
      if (!user) {
        throw { status: 400, message: "Invalid credentials" };
      }

      return bcrypt.compare(password, user.password).then((isPasswordValid) => {
        if (!isPasswordValid) {
          throw { status: 400, message: "Invalid credentials" };
        }
        const token = generateToken(user);
        // If login is successful, send back the role attribute
        res.status(200).json({
          message: "Login successful",
          success: true,
          role: user.role,
          token,
        });
      });
    })
    .catch((error) => {
      console.error("Error while login:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const getOrderById = async (req, res) => {
  try {
    const { orderID } = req.params;

    // Query the Order table for the order with the specified orderID
    const order = await Order.findOne({
      where: {
        orderID: orderID,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error retrieving order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
        picture: "0",
      });
    })
    .then((newUser) => {
      res.status(201).json({ success: true, newUser });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const validateUserDataController = (req, res) => {
  // Extract user data from request body
  const { email, contactNumber } = req.body;

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

      // If no conflicts, return success
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error("Error validating user data:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};

const uploadProfile = (req, res) => {
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: `${req.body.email}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
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
      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
      });
    })
    .catch((err) => {
      // Handle any errors that occurred during the process
      res
        .status(500)
        .json({ success: false, message: "Server error, try after some time" });
    });
};
const uploadPrescription = (req, res) => {
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: `${req.body.email}_prescription`,
      width: 500,
      height: 500,
      crop: "fill",
    })
    .then((result) => {
      // Create a new record in the Prescription table
      return Prescription.create({
        customerEmail: req.body.email,
        picture: result.secure_url,
        duration: req.body.duration, // Extract duration from the request body
      });
    })
    .then((data) => {
      // The prescription has been successfully added
      res.status(200).json({
        success: true,
        message: "Prescription uploaded successfully",
        link: data.picture,
      });
    })
    .catch((err) => {
      // Handle any errors that occurred during the process
      res
        .status(500)
        .json({ success: false, message: "Server error, try after some time" });
    });
};

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,
    // Add other user-related data to the payload if needed
  };
  // Set the expiration time as desired (e.g., 1 day)
  const expiresIn = "1d";

  // Sign the token with a secret key
  const token = jwt.sign(payload, "ruralMed", { expiresIn });
  return token;
};
const getUserEmailByContactNumber = (req, res) => {
  const { contactNumber } = req.body;
  // Find the user with the provided contactNumber
  User.findOne({
    where: {
      contactNumber,
    },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({ email: user.email });
      } else {
        res
          .status(404)
          .json({ error: "User not found with the provided contactNumber" });
      }
    })
    .catch((error) => {
      console.error("Error fetching email by contactNumber:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const getUserProfile = async (req, res) => {
  try {
    const { userEmail } = req.params;
    // Assuming you have a User model with a method to find a user by email
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract relevant user profile information
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await Notifications.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getNotifications = async (req, res) => {
  try {
    const { email, role } = req.params;

    // Fetch notifications based on the provided email and role
    const notifications = await Notifications.findAll({
      where: {
        [Op.or]: [
          { riderId: email },
          { ownerId: email },
          { customerId: email },
        ],
      },
    });

    // Update isOpenedBy for the fetched notifications

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching and updating notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateNotifications = async (req, res) => {
  try {
    const { email, role } = req.params;
    // Fetch notifications based on the provided email and role
    const notifications =
      // Update isOpenedBy for the fetched notifications
      await Notifications.update(
        { [`isOpenedBy${role}`]: true },
        {
          where: {
            [Op.and]: [
              { [`${role.toLowerCase()}Id`]: email },
              { [`isOpenedBy${role}`]: false },
            ],
          },
        }
      );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateNotificationStatus = async (req, res) => {
  try {
    const { notificationID, role } = req.params;
    // Find the notification by ID
    const notification = await Notifications.findByPk(notificationID);

    if (!notification) {
      // Notification not found
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    // Check if the notification status needs to be updated
    if (notification[`statusOf${role}`] !== "Read") {
      // Update notification status to 'Read'
      await notification.update({ [`statusOf${role}`]: "Read" });

      // Successfully updated the notification status
      return res.status(200).json({ success: true, notification });
    } else {
      // Notification is already marked as 'Read'
      return res.status(200).json({
        success: false,
        message: "Notification already marked as Read",
      });
    }
  } catch (error) {
    console.error("Error updating notification status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productID } = req.params;

    // Query the Products table for the product with the specified productID
    const product = await Product.findOne({
      where: {
        productID: productID,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signupController,
  loginController,
  uploadPrescription,
  uploadProfile,
  validateUserDataController,
  getUserEmailByContactNumber,
  getUserProfile,
  createNotification,
  getNotifications,
  updateNotifications,
  updateNotificationStatus,
  getOrderById,
  getProductById,
};
