const Sequelize = require('sequelize'),
  sequelize = new Sequelize('postgres://node:node@localhost:5432/dms');

module.exports = sequelize;

