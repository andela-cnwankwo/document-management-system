//  Defnes various services for the user object
const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');

// Call the user model and specify the arguments.
const User = require('../../app/models/user')(sequelize, Sequelize);

module.exports.createUser = (req, done) => {
  const newUser = req.user;
  User.findOrCreate({
    where: {
      email: newUser.email
    },
    defaults: {
      userId: newUser.userId,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role
    }
  })
    .spread((user, created) => done(created));
};
