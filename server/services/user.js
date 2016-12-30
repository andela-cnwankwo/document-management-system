//  Defines various services for the user object

const Sequelize = require('sequelize');
const sequelize = require('../../settings/connect');
const User = require('../../app/models/user')(sequelize, Sequelize);
const jwt = require('jsonwebtoken');

const secret = 'documentmanagement'; // Specify a secret to sign json web tokens

sequelize.sync({ });

/**
 * Create a new user
 * @param {object} req
 * @param {function} done // Callback
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createUser = (req, res) => {
  const newUser = req.body.user;
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
    .spread((user, created) => {
      // // TODO: when a user logs in after being created
      // // A jwt token will be signed for the user with the email and password as payload.
      // userToken(user);
      // done(created);
      return (created)
        ? res.status(200).send({ message: 'New User Created!' })
        : res.status(400).send({ message: 'User already exists' });
    });
};

/**
 * Get a user token
 * @param {object} user
 * @returns {string} specied user token.
 */
module.exports.userToken = (user) => jwt.sign(
  { user: user.username, password: user.password }
  , secret
);

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} done // Callback
 * @returns {object} specied user.
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
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} done // Callback
 * @returns {object} roles for the specied user.
 */
module.exports.getUserRole = (req, done) => {
  User.findOne({
    where: {
      username: req.username,
      password: req.password
    }
  }).then(data => done(data.roleId))
  .catch(() => done(false));
};
