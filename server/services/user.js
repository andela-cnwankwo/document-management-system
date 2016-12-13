//  Defines various services for the user object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');

// Call the user model and specify the arguments.
const User = require('../../app/models/user')(sequelize, Sequelize);

sequelize.sync({ });

/**
 * Create a new user
 */
module.exports.createUser = (req, done) => {
  const newUser = req.user;
  User.findOrCreate({
    where: {
      email: newUser.email
    },
    defaults: {
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      roleId: newUser.roleId
    }
  })
    .spread((user, created) => done(created));
};

/**
 * Get a user data based on the email specified
 */
module.exports.getUser = (req, done) => {
  User.find({
    where: {
      email: req.user.email
    }
  }).then(data => done(data))
  .catch(() => false);
};

/**
 * Gets all registered users in the database
 */
module.exports.getUserRole = (req, done) => {
  User.findOne({
    where: {
      username: req.username,
      password: req.password
    }
  }).then((data) => done(data.roleId))
  .catch(() => done(false));
};
