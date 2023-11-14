'use strict';
const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const USER = sequelize.define('users', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
    contactNumber: {
      type: DataTypes.STRING, 
      allowNull: false, 
      unique:true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityNearBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    picture:{
      type: DataTypes.STRING,
      allowNull:true
    }
    
  });
sequelize.sync().then(()=>{console.log('created users')}).catch()

module.exports=USER

