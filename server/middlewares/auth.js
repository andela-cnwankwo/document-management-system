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
    jwt.verify(jwtcode, secret, (err, token) => {
      if (err) {
        return res.status(401)
          .send({ message: 'Invalid Token, User unauthorised!' });
      }
      req.token = token;
      done();
    }
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
    jwt.verify(jwtcode, secret, (err, token) => {
      if (err) {
        return res.status(401)
          .send({ message: 'Invalid Token, User unauthorised!' });
      } else if ((token.userRoleId !== 1)) {
        return res.status(401)
          .send({ message: 'User unauthorised! login as admin' });
      }
      req.token = token;
      done();
    }
    );
  }
};

module.exports = validation;
