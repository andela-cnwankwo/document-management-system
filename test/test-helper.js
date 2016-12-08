const env = process.env.NODE_ENV || 'test',
  config = require('../settings/config.json')[env],
  Sequelize = require('sequelize'),

  // Initialize Sequelize with test configurations.
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, dialect: config.dialect
  });

module.exports = sequelize;
