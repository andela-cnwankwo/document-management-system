const express = require('express');
const userService = require('../../server/services/user');
const roleService = require('../../server/services/role');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => (res.status(200))
    ? res.status(200).send({
      message: 'Welcome to the Document Management App!'
    })
    : res.status(404));

// Setup users route to create and retreive users.
router.route('/users')
  .post((req, res) => {
    userService.createUser(req.body, (data) => {
      return (data)
        ? res.status(200).send({ message: 'New User Created!' })
        : res.status(400).send({ message: 'User already exists' });
    });
  })
  .get((req, res) => {
    if (!req.query) {
      res.status(401).send({ message: 'User unauthorised!' });
    }
    userService.getUserRole(req.query, (data) => {
      return (data === 1)
        ? res.status(200).send({ message: 'Query Successful!' })
        : res.status(401).send({ message: 'User unauthorised!' });
    });
  });

// Setup route to retrieve user data
router.route('/users/email')
  .get((req, res) => {
    userService.getUser(req.body, (data) => {
      return (data)
        ? res.status(200).send({ user: data })
        : res.status(404).send({ message: 'User not Found' });
    });
  });

// Setup route to create roles.
router.route('/roles')
  .post((req, res) => {
    roleService.createRole(req.body, (data) => {
      return (data)
        ? res.status(200).send({ message: 'Role Updated!' })
        : res.status(401).send({ message: 'User unauthorized!' });
    });
  })
  .get((req, res) => {
    if (!req.query.title) {
      roleService.getAllRoles(req.query, (data) => {
        return (data)
          ? res.status(200).send(data)
          : res.status(404).send({ message: 'No roles found!' });
      });
    }
    roleService.getRole(req.query, (data) => {
      return (data)
        ? res.status(200).send({ message: 'Role exists!' })
        : res.status(404).send({ message: 'No role found!' });
    });
  });

module.exports = router;
