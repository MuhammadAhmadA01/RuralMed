const { Op } = require("sequelize");
const moment=require('moment')
const Product = require("../../Models/Product/products");
const Prescription = require("../../Models/Prescription/prescription");
const User = require("../../Models/User/User");
const jwt = require("jsonwebtoken");
const Notifications = require("../../Models/Notifications/Notification");
const bcrypt = require("bcrypt");
const cloudinary = require("../../config/cloudinary");
const Order = require("../../Models/Order/Order");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const Meeting=require('../../Models/Meeting/Meeting')
const Payment=require('../../Models/Payment/Payments')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ruralmed123@gmail.com',
    pass: 'cayp saoz enau xhlq'
  }
});

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
}
const formatTime = (timeString) => {
  const timeComponents = timeString.split(":");
  let hours = parseInt(timeComponents[0]);
  const minutes = timeComponents[1];
  let meridiem = "AM";

  if (hours >= 12) {
    meridiem = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }

  return `${hours}:${minutes} ${meridiem}`;
};

// Controller method to send OTP
const sendOTP =  async (req, res) => {
  
  const { email } = req.body;
  console.log(email)
  const otp = generateOTP();
  console.log(otp)
  const mailOptions = {
    from: 'ruralmed123@gmail.com',
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`
  };

  const info= await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent successfully', otp,success:true});
    }
  });
  
};

// Controller method to send OTP
const sendOrderEmail =  async (req, res) => {

  const { newOrder } = req.body;
  console.log(newOrder)
  
  const mailOptions = {
    from: 'ruralmed123@gmail.com',
    to: newOrder.customerID,
    subject: 'Order Confirmation',
    text: `Your Order number is ${newOrder.orderID}\n -> Order Placed on: ${newOrder.dateOfOrder}\n ->  Order sub-total: ${newOrder.orderTotal - newOrder.shippingCharges}\n -> Shipping Charges: ${newOrder.shippingCharges}\n -> Order Total: ${newOrder.orderTotal}`
  };
  

  const info= await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      
    } else {
      console.log('Email sent: ' + info.response);
      
    }
    
  });
  
  const mailOptionsRider = {
    from: 'ruralmed123@gmail.com',
    to: newOrder.riderId,
    subject: 'Order Recieved',
    text: `Your have been assigned an Order number is ${newOrder.orderID}\n -> Order Assigned on: ${newOrder.dateOfOrder}\n -> Your fee: ${newOrder.shippingCharges}\n -> Order Total to be picked from Customer: ${newOrder.orderTotal}`
  };
  
  const infoRider= await transporter.sendMail(mailOptionsRider, (error, info) => {
    if (error) {
      console.log(error);
      
    } else {
      console.log('Email sent: ' + infoRider.response);
      
    }
    
  })
  const mailOptionsOwner = {
    from: 'ruralmed123@gmail.com',
    to: newOrder.ownerId,
    subject: 'Order Recieved',
    text: `Your have been received an Order number is ${newOrder.orderID}\n -> Order Received on: ${newOrder.dateOfOrder}\n  -> Your Amount to be collected: ${newOrder.orderTotal-newOrder.shippingCharges}`
  };
  
  const infoOwner= await transporter.sendMail(mailOptionsOwner, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send Email' });

    } else {
      console.log('Email sent: ' + infoOwner.response);
      res.status(200).json({ message: 'Order Placed email sent successfully', otp,success:true});
      
    }
    
  })
  

};
const sendMeetingEmail =  async (req, res) => {

  const { newMeeting } = req.body;
  console.log(newMeeting)
  
  const mailOptions = {
    from: 'ruralmed123@gmail.com',
    to: newMeeting.customerId,
    subject: 'Meeting Confirmation',
    text: `Your Meeting number is ${newMeeting.meetingID}\n -> Meeting Scheduled for: ${newMeeting.scheduledDate}\n ->  Meeting charges: ${newMeeting.meetingFee}\n -> Please be there in the clinic on time: ${formatTime(newMeeting.startTime)}\n\n\n Regards\nTeam Ruralmed`
  };
  

  const info= await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      
    } else {
      console.log('Email sent: ' + info.response);
      
    }
    
  });
  
  const mailOptionsDvm = {
    from: 'ruralmed123@gmail.com',
    to: newMeeting.dvmId,
    subject: 'Meeting Appointment',
    text: `Your have been booked for a meeting of which Meeting number is ${newMeeting.meetingID}\n -> Appointment Date is: ${newMeeting.scheduledDate}\n -> Your fee: ${newMeeting.meetingFee}\n -> Meeting Duration: 20 mins\n -> Meeting will start at: ${formatTime(newMeeting.startTime)}\n\n\n Regards\nTeam Ruralmed`
  };
  
  const infoDvm= await transporter.sendMail(mailOptionsDvm, (error, info) => {
    if (error) {
      console.log(error);
   res.status(500).json({ message: 'Failed to send Email' });

      
    } else {
      console.log('Email sent: ' + infoDvm.response);
  res.status(200).json({ message: 'Order Placed email sent successfully', otp,success:true});

      
    }
    
  

  });
}

// Controller method to verify OTP
const verifyOTP = (req, res) => {
  const { otp, userEnteredOTP } = req.body;

  if (otp === userEnteredOTP) {
    res.status(200).json({ message: 'OTP verified successfully', success:true});
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};


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

const updateUserFieldController = (req, res) => {
  // Extract data from request body
  const { fieldName, updatedValue, email } = req.body;

  // Define the fields that can be updated
  const allowedFields = ['contactNumber', 'address', 'cityNearBy'];

  // Check if the provided field name is allowed to be updated
  if (!allowedFields.includes(fieldName)) {
    return res.status(400).json({ error: 'Invalid field name' });
  }

  // Find the user based on the provided email
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        throw { status: 404, message: 'User not found' };
      }

      // Check if the field to be updated is contactNumber
      if (fieldName === 'contactNumber') {
        // Check if the updated contact number already exists in the database
        return User.findOne({ where: { contactNumber: updatedValue } }).then((existingUser) => {
          if (existingUser && existingUser.email !== email) {
            // If the contact number exists for another user, send failure response
            throw { status: 400, message: 'Contact number already exists' };
          }
          // Update the specified field
          user[fieldName] = updatedValue;
          // Save the updated user
          return user.save();
        });
      } else {
        // For other fields, directly update and save the user
        user[fieldName] = updatedValue;
        return user.save();
      }
    })
    .then((updatedUser) => {
      res.status(200).json({ success: true, updatedUser });
    })
    .catch((error) => {
      console.error('Error updating user field:', error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Internal Server Error' });
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
const getOrderCounts = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Check if role is 'Customer'
    if (role === 'Customer') {
      // Get count of orders for the given customerID
      const totalOrders = await Order.count({ where: { customerID: email } });

      // Get count of reviewed orders for the given customerID
      const reviewedOrders = await Order.count({ where: { customerID: email, hasReviewed: true } });

      return res.status(200).json({ totalOrders, reviewedOrders });
    }

    // Check if role is 'Rider'
    if (role === 'Rider') {
      // Get count of orders for the given riderId
      const totalOrders = await Order.count({ where: { riderId: email } });

      // Get count of reviewed orders for the given riderId
      const reviewedOrders = await Order.count({ where: { riderId: email, hasReviewed: true } });

      return res.status(200).json({ totalOrders, reviewedOrders });
    }

    // Check if role is 'Owner'
    if (role === 'Owner') {
      // Get count of orders for the given ownerId
      const totalOrders = await Order.count({ where: { ownerId: email } });

      // Get count of reviewed orders for the given ownerId
      const reviewedOrders = await Order.count({ where: { ownerId: email, hasReviewed: true } });

      return res.status(200).json({ totalOrders, reviewedOrders });
    }

    // If role is neither 'Customer', 'Rider', nor 'Owner'
    return res.status(400).json({ message: 'Invalid role provided' });
  } catch (error) {
    console.error('Error getting order counts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const updateUserAddress = async (req, res) => {
  try {
    console.log(req.body)
    const { address, userEmail } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email:userEmail } });

    if (!user) {
      // If user with the provided email is not found, send a 404 response
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's address
    user.address = address;
    await user.save();

    // Send a success response
    res.status(200).json({ success: true, message: 'Address updated successfully' });
  } catch (error) {
    // If any error occurs, send a 500 response with the error message
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getMeetingById = async (req, res) => {
  try {
    const { meetingID } = req.params;

    // Query the Meeting table for the meeting with the specified meetingID
    const meeting = await Meeting.findOne({
      where: {
        meetingID: meetingID,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    return res.status(200).json({ meeting });
  } catch (error) {
    console.error("Error retrieving meeting:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadPayment = (req, res) => {
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: `${req.body.email}_payment`,
      width: 500,
      height: 500,
      crop: "fill",
    })
    .then((result) => {
      // Create a new record in the Prescription table
      return Payment.create({
        picture: result.secure_url,
        paymentMode: req.body.mode,
        orderID:req.body.orderID
      });
    })
    .then((data) => {
      // The prescription has been successfully added
      res.status(200).json({
        success: true,
        message: "Payment uploaded successfully",
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

module.exports = {
  signupController, //sign up user data into db
  loginController, //checking pohone no and password of user from db
  uploadPrescription, //uploading prescription to server(cloud)
  uploadProfile, //upload profiile picture at time of signup
  validateUserDataController, //data validation at time of signup
  getUserEmailByContactNumber, //getting email of user by passing contact no
  getUserProfile, //getting user profile
  createNotification, //creating notification of order only in db
  getNotifications, //getting notifications of a specific user
  updateNotifications, //updating notification when user opens it
  updateNotificationStatus, //updating notifications when user read it
  getOrderById, //getting order by ID
  getProductById, //getting a specific product by ID
  sendOTP, //sending otp code on user email
  verifyOTP, //verifying user entered otp 
  updateUserFieldController, //updating data of user
  getOrderCounts, //aik user k ktne orders hain
  updateUserAddress, //user ki locatiuon update
  getMeetingById, //meeting aa ri hai by ID
  uploadPayment,//payment ss cloud pe iupload ho rha hai
  sendOrderEmail, //order hone pe users ko email ja ri hai
  sendMeetingEmail //meeting hone pe customer or dvm ko email
};
