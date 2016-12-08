const express = require('express');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => {
  return (res.status(200))
    ? res.status(200).send({ message: 'Welcome to the Document Management App!'})
    : res.status(404);
});

module.exports = router;
