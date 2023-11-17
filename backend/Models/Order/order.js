const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Orders = sequelize.define("orders", {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  customerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dateOfOrder: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  riderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingCharges: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "in-progress",
  },
  isPrescription: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  orderDetails: {
    type: DataTypes.JSONB, // Use JSONB for array of objects
    allowNull: false,
    defaultValue: [], // Default value as an empty array
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Created Orders table");
  })
  .catch();

module.exports = Orders;
