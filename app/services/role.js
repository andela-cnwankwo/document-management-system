//  Defines various services for the role object

const db = require('../models');

const Role = db.Role;

/**
 * Create a new role
 * @param {object} req
 * @param {function} res // Object
 * @returns {boolean} true if created,false otherwise
 */
module.exports.createRole = (req, res) => {
  Role.findOrCreate({
    where: {
      title: req.body.title
    },
    defaults: {
      title: req.body.title
    }
  })
  .spread((role, created) => {
    if (!created) {
      return res.status(400).send({ message: 'Role Already Exists!' });
    }
    return res.status(201).send({ role, message: 'Role Added!' });
  });
};


/**
 * Update role
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.updateRole = (req, res) => {
  // @TODO: Check request body to ensure data compliance.
  Role.find({
    where: {
      id: req.params.id
    }
  }).then((role) => {
    if (!role) {
      return res.status(404).send({ message: 'Role Not Found' });
    }
    role.update({
      title: req.body.title
    }).then(() => {
      res.status(200).send({ message: 'Role Updated!' });
    });
  });
};

/**
 * Delete a role
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.deleteRole = (req, res) => {
  Role.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((data) => {
    if (data === 1) {
      return res.status(200).send({ message: 'Role Removed!' });
    }
    return res.status(404).send({ message: 'Role Not Found' });
  });
};

/**
 * Get role
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified role.
 */
module.exports.getRole = (req, res) => {
  Role.find({
    where: {
      id: req.params.id
    }
  }).then((role) => {
    if (!role) {
      return res.status(404).send({ message: 'Role Not found' });
    }
    return res.status(200).send(role);
  }
  );
};

/**
 * Get all roles
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} all roles.
 */
module.exports.getAllRoles = (req, res) => {
  Role.findAll().then((roles) => {
    if (!roles) {
      return res.status(404).send({ message: 'No role found' });
    }
    return res.status(200).send(roles);
  }
  );
};
