const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config'); // Assuming you have a database configuration file

const Meeting = sequelize.define('Meetings', {
  meetingID: {
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
  scheduledDate: {
    type: DataTypes.STRING,
    allowNull:false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull:false 
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull:false 
  },
  customerId:{
    type:DataTypes.STRING,
    allowNull:false
  },
dvmId:{
  type:DataTypes.STRING,
  allowNull:false
},
status:{
  type:DataTypes.STRING,
  allowNull:false
},

hasReviewed: {
  type: DataTypes.BOOLEAN, 
  allowNull: true,
  defaultValue: false, 
},
});

sequelize.sync()
  .then(() => {
    console.log('Meeting model synced with database');
  })
  .catch((error) => {
    console.error('Error syncing DVM model with database:', error);
  });

module.exports = Meeting;
