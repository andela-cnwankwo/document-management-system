//  Defines various services for the role object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');
const userService = require('./user');
const validate = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'documentmanagement';


// Call the doc model and specify the arguments.
const Doc = require('../../app/models/doc')(sequelize, Sequelize);

sequelize.sync({ });

/**
 * Create a new document
 * @param {object} req
 * @param {function} res // Callback
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createDocument = (req, res) => {
  const newDocument = req.body.document;
  Doc.findOrCreate({
    where: {
      title: newDocument.title
    },
    defaults: {
      published: newDocument.published,
      title: newDocument.title,
      access: newDocument.access,
      content: newDocument.content,
      ownerId: newDocument.ownerId
    }
  })
    .spread((doc, created) => (doc)
        ? res.status(200).send(doc)
        : res.status(400).send({ message: 'Could not create document' }));
};

/**
 * Get created document
 * @param {object} req
 * @param {function} res // Response
 * @returns {object} specified document.
 */
module.exports.getDocument = (req, res) => {
  const jwtcode = req.headers.authorization;
  const token = jwt.verify(jwtcode, secret);
  if (token.userRoleId === 1) {
    Doc.find({
      where: {
        id: req.params.id
      }
    }).then(data => (data)
    ? res.status(200).send(data)
    : res.status(404).send({ message: 'Document not found' }));
  }
};
