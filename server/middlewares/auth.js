const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'documentmanagement';

const validation = {

  /**
   * Validate user token
   * @method validateToken
   * @param {object} req
   * @param {object} res
   * @param {function} done callback
   * @returns {object} http callback.
   */
  validateToken(req, res, done) {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'User unauthorised!' });
    }
    const jwtcode = req.headers.authorization;
    jwt.verify(jwtcode, secret, (err, token) => (err)
    ? res.status(401).send({ message: 'Invalid Token, User unauthorised!' })
    : done()
    );
  },

  /**
   * Validate admin user
   * @method validateAdmin
   * @param {object} req
   * @param {object} res
   * @param {function} done callback
   * @returns {object} http callback.
   */
  validateAdmin(req, res, done) {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'User unauthorised!' });
    }
    const jwtcode = req.headers.authorization;
    jwt.verify(jwtcode, secret, (err, token) => (err)
    ? res.status(401).send({ message: 'Invalid Token, User unauthorised!' })
    : (token.userRoleId !== 1)
    ? res.status(401).send({ message: 'User unauthorised! login as admin' })
    : done()
    );
  }
};

module.exports = validation;
