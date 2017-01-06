require('dotenv').config();
const env = process.env.NODE_ENV || 'development',
  config = require('./config.json')[env],
  Sequelize = require('sequelize'),
  // Initialize Sequelize with specified configurations.
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: config.host, dialect: config.dialect
  });

module.exports = sequelize;
