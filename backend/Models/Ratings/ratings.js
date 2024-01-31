const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");
const Ratings = sequelize.define("ratings", {
  ratingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_for_rider: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_for_Owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  review: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log("created ratings");
  })
  .catch();
module.exports = Ratings;
