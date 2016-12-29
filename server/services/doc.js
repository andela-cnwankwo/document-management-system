//  Defines various services for the role object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');
const userService = require('./user');

// Call the doc model and specify the arguments.
const Doc = require('../../app/models/doc')(sequelize, Sequelize);

sequelize.sync({ });

/**
 * Create a new document
 * @param {object} req
 * @param {function} done // Callback
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createDocument = (req, done) => {
  const newDocument = req.document;
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
    .spread((doc, created) => done(doc));
};

/**
 * Get created document
 * @param {object} req
 * @param {function} done // Callback
 * @returns {object} specified document.
 */
module.exports.getDocument = (req, done) => {
  Doc.find({
    where: {
      ownerId: req.ownerId
    }
  }).then(data => done(data))
.catch(() => false);
};