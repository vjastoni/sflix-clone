const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Movie = sequelize.define('movie', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ratings: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Movie;
