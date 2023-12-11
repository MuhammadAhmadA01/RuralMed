const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Notifications = sequelize.define("notifications", {
    notificatonID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      
    orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfNotiifcation: {
    type: DataTypes.DATE,
  },
  riderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusOfOwner: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'Unread'
  },
  isOpenedByOwner: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
  statusOfRider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'Unread'
  },
  isOpenedByRider: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
  statusOfCustomer: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'Unread'
  },
  isOpenedByCustomer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Created Notifications table");
  })
  .catch();

module.exports = Notifications;
