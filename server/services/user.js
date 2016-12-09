//  Defnes various services for the user object
const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');

// Call the user model and specify the arguments.
const User = require('../../app/models/user')(sequelize, Sequelize);

sequelize.sync({});

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
      password: newUser.password
    }
  })
    .spread((user, created) => done(created));
};

module.exports.getUser = (req, done) => {
  User.find({
    where: {
      email: req.user.email
    }
  }).then(data => done(data))
  .catch(() => false);
};
