// Import necessary modules
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config'); // Assuming you have a database configuration file

// Define the DVM model
const DVM = sequelize.define('DVM', {
  dvmID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  meetingFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 2000 
    }
  },
  offDay:{
    type:DataTypes.STRING,
    allowNull:false
  },
  startTime:{
    type:DataTypes.TIME,
    allowNull:false
  },
  endTime:{
    type:DataTypes.TIME,
    allowNull:false
  },
clinicLocation:{
    type:DataTypes.STRING,
    allowNull:false
},
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  speciality: {
    type: DataTypes.STRING,
    allowNull:false 
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  experience:{
    type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
      max:25
    }
  }

});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('DVM model synced with database');
  })
  .catch((error) => {
    console.error('Error syncing DVM model with database:', error);
  });

// Export the DVM model
module.exports = DVM;
