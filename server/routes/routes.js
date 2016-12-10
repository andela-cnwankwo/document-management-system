const express = require('express');
const userService = require('../../server/services/user');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => (res.status(200))
    ? res.status(200).send({
      message: 'Welcome to the Document Management App!'
    })
    : res.status(404));

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
    userService.getAllUsers(req.query, (data) => {
      return (data === 1)
        ? res.status(200).send({ message: 'Query Successful!' })
        : res.status(401).send({ message: 'User unauthorised!' });
    });
  });

router.route('/users/email')
  .get((req, res) => {
    userService.getUser(req.body, (data) => {
      return (data)
        ? res.status(200).send({ user: data })
        : res.status(404).send({ message: 'User not Found' });
    });
  });
module.exports = router;
