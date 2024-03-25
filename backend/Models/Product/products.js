const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Product = sequelize.define("products", {
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  has_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue:true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Product;
