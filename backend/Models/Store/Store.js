const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Store = sequelize.define("stores", {
  storeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  store_address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  storeContact: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  storeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created store");
  })
  .catch();

module.exports = Store;
