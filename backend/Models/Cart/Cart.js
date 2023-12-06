const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Cart = sequelize.define("cart", {
  cartID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  customer_contact: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  cart_details: {
    type: DataTypes.JSONB, // Use JSONB for array of objects
    allowNull: false,
    defaultValue: [], // Default value as an empty array
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created cart");
  })
  .catch();
module.exports = Cart;
