const express = require('express');
const userService = require('../../server/services/user');
const roleService = require('../../server/services/role');
const documentService = require('../../server/services/doc');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => (res.status(200))
    ? res.status(200).send({
      message: 'Welcome to the Document Management App!'
    })
    : res.status(404));

// Setup users route to create and retreive users.
router.route('/users')
  .post(userService.createUser)
  .get((req, res) => {
    if (!req.query) {
      res.status(401).send({ message: 'User unauthorised!' });
    }
    userService.getUserRole(req.query, (data) => (data === 1)
        ? res.status(200).send({ message: 'Query Successful!' })
        : res.status(401).send({ message: 'User unauthorised!' }));
  });

// Setup route to retrieve user data
router.route('/users/email')
  .get((req, res) => {
    if (!req.query) {
      res.status(401).send({ message: 'User unauthorised!' });
    }
    userService.getUser(req.body, (data) => (data)
        ? res.status(200).send({ user: data })
        : res.status(404).send({ message: 'User not Found' }));
  });

// Setup route to create roles.
router.route('/roles')
  .post(roleService.createRole)
  .get((req, res) => {
    if (!req.query.title) {
      roleService.getAllRoles(req.query, (data) => (data)
          ? res.status(200).send(data)
          : res.status(404).send({ message: 'No roles found!' }));
    }
    roleService.getRole(req.query, (data) => (data)
        ? res.status(200).send({ message: 'Role exists!' })
        : res.status(404).send({ message: 'No role found!' }));
  });

  // Setup route for documents
router.route('/documents')
  .post(documentService.createDocument)
  .get((req, res) => {
    if (!req.query) {
      res.status(401).send({ message: 'User Unauthorised'  });
    }
    documentService.getDocument(req.query, (data) => (data)
    ? res.status(200).send(data)
    : res.status(401).send({ message: 'User Unauthorised' }));
  });


module.exports = router;
