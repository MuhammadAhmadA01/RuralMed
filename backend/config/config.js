const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'aimmi.a01',
  database: 'ruralMed',
});
sequelize.authenticate().then(()=>{console.log("success")
}).catch(err=>console.log(err))  

module.exports = { sequelize, DataTypes };