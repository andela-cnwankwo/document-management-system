const express = require('express');
const userService = require('../../server/services/user');
const roleService = require('../../server/services/role');
const documentService = require('../../server/services/doc');
const validate = require('../middlewares/auth');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the Document Management App!'
  });
});

// Route to create and retreive users.
router.route('/users')
  .post(userService.createUser)
  .get(validate.validateAdmin, userService.getAllUsers);

// Route to retrieve single user data
router.route('/users/:username')
  .get(validate.validateToken, userService.getUser)
  .put(validate.validateToken, userService.updateUser)
  .delete(validate.validateAdmin, userService.deleteUser);

// User login route
router.route('/login')
  .post(userService.login);

router.route('/logout')
  .post(userService.logout);

// Route to create roles
router.route('/roles')
  .post(validate.validateAdmin, roleService.createRole);

// Retrieve all roles
router.route('/roles/all')
  .get(validate.validateAdmin, roleService.getAllRoles);

// Retrieve a single role
router.route('/roles/:id')
  .get(validate.validateAdmin, roleService.getRole)
  .put(validate.validateAdmin, roleService.updateRole)
  .delete(validate.validateAdmin, roleService.deleteRole);

// Route for documents
router.route('/documents')
  .post(validate.validateToken, documentService.createDocument)
  .get(validate.validateToken, documentService.getAllDocuments);

// Retrieve a single document
router.route('/documents/:id')
  .get(validate.validateToken, documentService.getDocument)
  .put(validate.validateToken, documentService.updateDocument)
  .delete(validate.validateToken, documentService.deleteDocument);

// Search documents
router.route('/documents/find')
  .post(validate.validateToken, documentService.searchDocuments);

module.exports = router;
