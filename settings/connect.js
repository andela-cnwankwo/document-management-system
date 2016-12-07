const env = process.env.NODE_ENV || 'development',
  config = require('./config.json')[env],
  Sequelize = require('sequelize'),
  // Initialize Sequelize with specified configurations.
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, dialect: config.dialect
  });

module.exports = sequelize;
