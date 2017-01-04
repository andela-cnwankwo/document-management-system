//  Defines various services for the user object

const Sequelize = require('sequelize');
const sequelize = require('../../settings/connect');
const User = require('../../app/models/user')(sequelize, Sequelize);
const jwt = require('jsonwebtoken');

const secret = 'documentmanagement'; // Specify a secret to sign json web tokens

/**
 * Create a new user
 * @param {object} req
 * @param {function} res // Callback
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createUser = (req, res) => {
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
        return res.status(201).send({ userToken: token, message: 'New User Created! Token expires in a day.' });
      }
      return res.status(400).send({ message: 'User already exists' });
    });
};

/**
 * User login
 * @param {object} req
 * @param {function} res // Callback
 * @returns {promise} http response.
 */
module.exports.login = (req, res) => {
  if (!req.query.username || !req.query.password) {
    return res.status(400).send({ message: 'Invalid request, specify username and password' });
  }
  User.find({
    where: {
      username: req.query.username,
      password: req.query.password
    }
  })
  .then((data) => {
    if (!data) {
      return res.status(404).send({ message: 'User not found' });
    }
    const token = jwt.sign({
      userId: data.id,
      userName: data.username,
      userRoleId: data.roleId
    }, secret, { expiresIn: '1 day' });
    return res.status(200).send({ userToken: token, message: 'Login Successful! Token expires in a day.' });
  })
  .catch(() =>
    res.status(404).send({ message: 'User not found' })
  );
};


/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Callback
 * @returns {object} specied user.
 */
module.exports.getUser = (req, res) => {
  // @TODO: get user details only when it is the currently looged in user or an admin.
  User.find({
    where: {
      username: req.params.username
    }
  }).then(data => (data)
    ? res.status(200).send(data)
    : res.status(404).send({ message: 'User not Found' })
    );
};

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Callback
 * @returns {object} specied user.
 */
module.exports.logout = (req, res) => res.status(200).send({ message: 'Logout Successful' });

/**
 * Update user information
 * @param {object} req
 * @param {function} res // Callback
 * @returns {promise} http response.
 */
module.exports.updateUser = (req, res) => {
  User.find({
    where: {
      username: req.params.username
    }
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.update({
      email: req.body.email,
      name: {
        first: req.body.firstname,
        last: req.body.lastname
      },
      password: req.body.password,
      roleId: req.body.roleId
    }).then((updatedUser) => {
      const token = jwt.sign({
        userId: updatedUser.id,
        userName: updatedUser.username,
        userRoleId: updatedUser.roleId
      }, secret, { expiresIn: '1 day' });
      return res.status(200).send({ userToken: token, message: 'Update Successful! Token expires in a day.' });
    })
    .catch(err => res.status(404).send({ message: 'User not found' })
    );
  });
};

/**
 * Delete a user
 * @param {object} req
 * @param {function} res // Callback
 * @returns {promise} http response.
 */
module.exports.deleteUser = (req, res) => {
  User.destroy({
    where: {
      username: req.params.username
    }
  })
  .then(data => (data === 1)
    ? res.status(200).send({ message: 'User Removed' })
    : res.status(404).send({ message: 'User Not found' })
  );
};

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Callback
 * @returns {object} specied user.
 */
module.exports.getAllUsers = (req, res) => {
  User.findAll({}).then(data => (data)
    ? res.status(200).send({ data })
    : res.status(404).send({ message: 'No User Found' })
  );
};
