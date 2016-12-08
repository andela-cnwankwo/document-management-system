const Sequelize = require('sequelize'),
  sequelize = require('../../settings/connect');

const User = sequelize.define('User', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.STRING
});

export default User;
