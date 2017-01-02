const express = require('express');
const userService = require('../../server/services/user');
const roleService = require('../../server/services/role');
const documentService = require('../../server/services/doc');
const validate = require('../middlewares/auth');

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
  .get(validate.validateAdmin, userService.getAllUsers);

// Setup route to retrieve single user data
router.route('/users/:username')
  .get(validate.validateToken, userService.getUser)
  // .put(validate.validateToken, userService.editUser)
  // .delete(validate.validateAdmin, userService.deleteUser)

// Setup route to create roles
router.route('/roles')
  .post(validate.validateAdmin, roleService.createRole);

// Retrieve all roles
router.route('/roles/all')
  .get(validate.validateAdmin, roleService.getRoles);


  // Setup route for documents
router.route('/documents')
  .post(validate.validateToken, documentService.createDocument)
  .get(validate.validateToken, documentService.getAllDocuments);

// Retrieve a document
router.route('/documents/:id')
  .get(validate.validateToken, documentService.getDocument);

router.route('/documents/all/:limit')
  .get(validate.validateToken, documentService.getAllDocuments);



module.exports = router;
