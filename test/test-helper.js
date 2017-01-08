require('dotenv').config();
const env = process.env.NODE_ENV || 'test',
  config = require('../settings/config.json')[env],
  Sequelize = require('sequelize'),

  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: config.host, dialect: config.dialect
  });

module.exports = sequelize;
