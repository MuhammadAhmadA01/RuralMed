const DVM = require('../../Models/DVM/DVM'); // Assuming the DVM model is defined in a separate file
const User=require('../../Models/User/User')
// Controller function to add data to the DVM table
const addDVM = async (req, res) => {
  try {
    // Extract data from the request body
    const { meetingFee, availability, speciality,email,startTime,endTime,offDay, clinicLocation } = req.body;

    // Add data to the DVM table using Sequelize's create method
    const dvm = await DVM.create({
      meetingFee,
      availability,
      speciality,
      email,
      startTime,
      endTime,
      offDay,
      clinicLocation
    });

    // Send a success response
    res.status(201).json({ message: 'DVM data added successfully', dvm });
  } catch (error) {
    // Handle errors
    console.error('Error adding DVM data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllDVMs = async (req, res) => {
  try {
    // Fetch all users where role is "DVM"
    const allUsers = await User.findAll({ where: { role: 'Dvm' } });

    // Fetch all DVM records from the database
    const allDVMs = await DVM.findAll();
    // Combine DVMs with additional user information
    const combinedDVMs = allDVMs.map((dvm) => {
      // Find corresponding user for the DVM by matching email
      const correspondingUser = allUsers.find((user) => user.email === dvm.email);
      // Add additional fields from the user to the DVM object
      return {
        ...dvm.toJSON(),
       picture: correspondingUser.picture,
        cityNearBy: correspondingUser.cityNearBy,
        name: `${correspondingUser.firstName} ${correspondingUser.lastName}`
      };

    });
    console.log(combinedDVMs)
    // Send the combined DVMs as a response
    res.json(combinedDVMs);
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error fetching all DVMs:', error);
    res.status(500).json({ error: 'An error occurred while fetching DVMs' });
  }
};

// Export the controller function
module.exports = { addDVM, getAllDVMs};
