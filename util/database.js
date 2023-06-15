const Sequelize = require('sequelize');

const sequelize = new Sequelize('sflix-database', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
