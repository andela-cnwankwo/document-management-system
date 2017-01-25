require('dotenv').config();
const env = process.env.NODE_ENV || 'test',
  config = require('../settings/config.json')[env],
  Sequelize = require('sequelize'),

  sequelize = new Sequelize(process.env[config.use_env_variable], config);

module.exports = sequelize;
