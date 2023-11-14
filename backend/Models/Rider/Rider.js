// backend/models/customer/customer.js
const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");


const Rider = sequelize.define('riders', {
  cnic: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  deliveryFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  availabilityStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize.sync().then(()=>{console.log('created riders')}).catch()

module.exports = Rider;
