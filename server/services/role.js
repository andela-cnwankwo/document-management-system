//  Defines various services for the role object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');
const userService = require('./user');

// Call the role model and specify the arguments.
const Role = require('../../app/models/role')(sequelize, Sequelize);

sequelize.sync({ });

/**
 * Create a new role
 * @param {object} req
 * @param {function} res // Callback
 * @returns {boolean} true if created,false otherwise
 */
module.exports.createRole = (req, res) => {
  userService.getUserRole(req.body.user, (data) => {
    if (data !== 1) {
      return res.status(401).send({ message: 'User unauthorized!' });
    }
    Role.findOrCreate({
      where: {
        title: req.body.newrole.title
      },
      defaults: {
        title: req.body.newrole.title
      }
    })
    .spread((role, created) =>
      res.status(200).send({ message: 'Role Updated!' }));
  });
};

/**
 * Get a created role
 * @param {object} req
 * @param {function} done // Callback
 * @returns {object} specified role.
 */
module.exports.getRole = (req, done) => {
  if (req.title) {
    Role.findOne({ where: { title: req.title } }).then((data) => {
      done(data);
    });
  }
};

/**
 * Get all roles
 * @param {object} req
 * @param {function} done // Callback
 * @returns {object} all roles.
 */
module.exports.getAllRoles = (req, done) => {
  Role.findAll().then((roles) => {
    done(roles);
  });
};
