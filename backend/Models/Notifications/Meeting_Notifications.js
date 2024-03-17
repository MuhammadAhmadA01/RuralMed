const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const Notifications = sequelize.define("meeting_notifications", {
  meetingNotificatonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  meetingID: {
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
  dvmId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusOfDvm: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Unread",
  },
  isOpenedByDvm: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  statusOfCustomer: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Unread",
  },
  isOpenedByCustomer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Created Notifications table");
  })
  .catch();

module.exports = Notifications;
