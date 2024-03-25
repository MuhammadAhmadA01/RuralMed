"use strict";
const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Payment = sequelize.define("payments", {
  paymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderID:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
});
sequelize
  .sync()
  .then(() => {
    console.log("created payments");
  })
  .catch();

module.exports = Payment;
