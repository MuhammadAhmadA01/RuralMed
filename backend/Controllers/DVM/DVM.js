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
// Export the controller function
module.exports = { addDVM};
