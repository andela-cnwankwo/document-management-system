//  Defines various services for the user object

const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const User = db.User, Role = db.Role;
const secret = process.env.SECRET || 'documentmanagement'; // Specify a secret to sign json web tokens

/**
 * Create a new user
 * @param {object} req
 * @param {function} res // Object
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createUser = (req, res) => {
  const newUser = req.body;
  const password = bcrypt.hashSync(newUser.password);
  Role.find({
    where: {
      id: newUser.roleId
    }
  })
  .then((data) => {
    if (!data) {
      return res.status(400).send({ message: 'Invalid roleId specified' });
    }

    User.findOrCreate({
      where: {
        email: newUser.email
      },
      defaults: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        password,
        roleId: newUser.roleId
      }
    })
      .spread((user, created) => { // used for returning multiple arguments.
        if (created) {
          const token = jwt.sign({
            userId: user.id,
            userName: user.username,
            userRoleId: user.roleId
          }, secret, { expiresIn: '1 day' });
          return res.status(201).send({
            user,
            userToken: token,
            message: 'New User Created! Token expires in a day.'
          });
        }
        return res.status(400).send({ message: 'User already exists' });
      });
  });
};

/**
 * User login
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.login = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({
      message: 'Invalid request, specify username and password'
    });
  }
  User.find({
    where: {
      username: req.body.username
    }
  })
  .then((data) => {
    if (!data) {
      return res.status(404).send({ message: 'Invalid username or password' });
    }
    if (!bcrypt.compareSync(req.body.password, data.password)) {
      return res.status(404).send({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({
      userId: data.id,
      userName: data.username,
      userRoleId: data.roleId
    }, secret, { expiresIn: '1 day' });
    return res.status(200).send({
      userToken: token,
      message: 'Login Successful! Token expires in a day.'
    });
  });
};


/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified user.
 */
module.exports.getUser = (req, res) => {
  // @TODO: get user details only when it is the currently looged in user
  User.find({
    where: {
      id: req.params.id
    }
  }).then((data) => {
    if (data) {
      return res.status(200).send(data);
    }
    return res.status(404).send({ message: 'User not Found' });
  });
};

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specied user.
 */
module.exports.logout = (req, res) => res.status(200).send({
  message: 'Logout Successful'
});

/**
 * Update user information
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.updateUser = (req, res) => {
  // @TODO: Check request body to ensure data compliance.
  User.find({
    where: {
      id: req.params.id
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
      password: bcrypt.hashSync(req.body.password),
      roleId: req.body.roleId
    }).then((updatedUser) => {
      const token = jwt.sign({
        userId: updatedUser.id,
        userName: updatedUser.username,
        userRoleId: updatedUser.roleId
      }, secret, { expiresIn: '1 day' });
      return res.status(200).send({
        userToken: token,
        message: 'Update Successful! Token expires in a day.'
      });
    });
  });
};

/**
 * Delete a user
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.deleteUser = (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((data) => {
    if (data === 1) {
      return res.status(200).send({ message: 'User Removed' });
    }
    return res.status(404).send({ message: 'User Not found' });
  });
};

/**
 * Get a user data based on the email specified
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specied user object.
 */
module.exports.getAllUsers = (req, res) => {
  User.findAll({}).then((data) => {
    if (data) {
      return res.status(200).send({ data });
    }
    return res.status(404).send({ message: 'No User Found' });
  });
};
