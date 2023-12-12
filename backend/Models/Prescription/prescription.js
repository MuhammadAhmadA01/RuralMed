"use strict";
const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Prescription = sequelize.define("prescription", {
  prescriptionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created prescription");
  })
  .catch();

module.exports = Prescription;
