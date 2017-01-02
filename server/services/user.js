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
 * @param {function} res // Callback
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createUser = (req, res) => {
  console.log(req.body);
  const newUser = req.body;
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
    .spread((user, created) => { // spread operator used for returning multiple arguments.
      if (created) {
        const token = jwt.sign({
          userId: user.id,
          userName: user.username,
          userRoleId: user.roleId
        }, secret, { expiresIn: '1 day' });
        return res.status(201).send({ message: `New User Created! Token: ${token} expires in a day.` })
      }
      return res.status(400).send({ message: 'User already exists' });
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
 * @param {function} res // Callback
 * @returns {object} specied user.
 */
module.exports.getUser = (req, res) => {
  if (!req.query) {
    return res.status(401).send({ message: 'User unauthorised!' });
  }
  User.find({
    where: {
      username: req.params.username
    }
  }).then(data => (data)
    ? res.status(200).send({ user: data })
    : res.status(404).send({ message: 'User not Found' })
    );
};

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Callback
 * @returns {object} specied user.
 */
module.exports.getAllUsers = (req, res) => {
  if (!req.query) {
    return res.status(401).send({ message: 'User unauthorised!' });
  }

  User.findAll({}).then(data => (data)
    ? res.status(200).send({ data })
    : res.status(404).send({ message: 'No User Found' })
  );
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
