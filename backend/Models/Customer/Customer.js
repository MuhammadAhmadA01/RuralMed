const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");
const Customer = sequelize.define("customers", {
  customerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cnic: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  deliveryFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created customer");
  })
  .catch();
module.exports = Customer;
