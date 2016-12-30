const jwt = require('jsonwebtoken');
const db = require('../../app/models');

const secret = process.env.SECRET || 'documentmanagement';

module.exports.validate = {
  validateToken(req, res, done) {
    console.log(req.headers.authorization);
  }
};
