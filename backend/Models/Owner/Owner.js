const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");
const owner = sequelize.define("owners", {
  ownerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  cnic: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created owner");
  })
  .catch();
module.exports = owner;
