
const User = require('../../Models/User/User');
const bcrypt = require('bcrypt');

const loginController = (req, res) => {
  const { contactNumber, password } = req.body;

  User.findOne({ where: { contactNumber } })
    .then(user => {
      if (!user) {
        throw {status:400, message: 'Invalid credentials' };
      }
      return bcrypt.compare(password, user.password);
    })
    .then(isPasswordValid => {
      if (!isPasswordValid) {
        throw {status:400, message: 'Invalid credentials' };
      }

      return res.status(200).json({ message: 'Login successful' });
    })
    .catch(error => {
      console.error('Error while login:', error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Internal Server Error' });
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
    picture,
  } = req.body;

  User.findOne({ where: { email } })
    .then(existingUser => {
      if (existingUser) {
        throw { status: 400, message: 'Email is already in use' };
      }

      return User.findOne({ where: { contactNumber } });
    })
    .then(existingContact => {
      if (existingContact) {
        throw { status: 400, message: 'Contact number is already in use' };
      }

      // Hash the password
      return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
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
        picture,
      });
    })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      console.error('Error creating user:', error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Internal Server Error' });
    });
};

module.exports = {signupController, loginController};
