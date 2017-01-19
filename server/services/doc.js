//  Defines various services for the role object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');

// Call the doc model and specify the arguments.
const Doc = require('../../app/models/doc')(sequelize, Sequelize);
const User = require('../../app/models/user')(sequelize, Sequelize);

sequelize.sync({});

/**
 * Create a new document
 * @param {object} req
 * @param {function} res // Object
 * @returns {boolean} true if created, false otherwise.
 */
module.exports.createDocument = (req, res) => {
  const token = req.token;
  const newDocument = req.body;
  Doc.findOrCreate({
    where: {
      title: newDocument.title,
      published: newDocument.published,
      ownerId: token.userId,
      ownerRoleId: token.userRoleId
    },
    defaults: {
      published: newDocument.published,
      title: newDocument.title,
      access: newDocument.access,
      content: newDocument.content,
      ownerId: token.userId,
      ownerRoleId: token.userRoleId
    }
  })
    .spread((doc, created) => {
      if (!created) {
        return res.status(409).send({ message: 'Document already exist' });
      }
      return res.status(201).send(doc);
    });
};

/**
 * Get created document
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified document.
 */
module.exports.getDocument = (req, res) => {
  const token = req.token;
  Doc.find({
    where: {
      id: req.params.id
    },
    attributes: [
      'id', 'published', 'title', 'access', 'content', 'ownerId', 'ownerRoleId'
    ]
  }).then((data) => {
    if (!data) {
      return res.status(404).send({ message: 'Document not found' });
    }
    if ((data && token.userRoleId === 1) || data.access === 'public') {
      return res.status(200).send(data);
    }
    if (data.ownerId === token.userId) {
      return res.status(200).send(data);
    }
    if (data
    && token.userRoleId === data.dataValues.ownerRoleId
    && data.access === 'role') {
      return res.status(200).send(data);
    }
    return res.status(401).send({ message: 'Cannot Access document' });
  });
};

/**
 * Update created document
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified document.
 */
module.exports.updateDocument = (req, res) => {
  // @TODO: Check request body to ensure data compliance.
  const token = req.token;
  Doc.find({
    where: {
      id: req.params.id
    },
    attributes: [
      'id', 'published', 'title', 'access', 'content', 'ownerId', 'ownerRoleId'
    ]
  }).then((doc) => {
    if (!doc) {
      return res.status(404).send({ message: 'Document not found' });
    }
    if ((token.userId !== doc.ownerId) && (token.userRoleId !== 1)) {
      return res.status(401).send({ message: 'Cannot Access document' });
    }
    doc.update({
      title: req.body.title,
      access: req.body.access,
      content: req.body.content
    }).then(() => res.status(200).send({ message: 'Document Updated!' }));
  });
};

/**
 * Get created document
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified document.
 */
module.exports.getAllDocuments = (req, res) => {
  const token = req.token;
  let ownerId;
  if (req.query.username) {
    User.find({
      where: {
        username: req.query.username
      }
    }).then((data) => {
      ownerId = data.id;
      if (token.userRoleId === 1) {
        Doc.findAll({
          where: {
            ownerId
          },
          order: [['published', 'DESC']],
          offset: req.query.offset,
          limit: req.query.limit
        })
          .then(response => res.status(200).send(response));
      } else {
        Doc.findAll({ order: [['published', 'DESC']],
          limit: req.query.limit,
          offset: req.query.offset,
          where: {
            ownerId,
            $or: {
              ownerRoleId: token.userRoleId,
              access: 'public',
              $and: {
                access: 'private',
                ownerId: token.userId
              }
            }
          },
          attributes: [
            'id',
            'published',
            'title',
            'access',
            'content',
            'ownerId',
            'ownerRoleId'
          ]
        }).then(response => res.status(200).send(response)
        );
      }
    }
    );
  } else if (token.userRoleId === 1) {
    Doc.findAll({
      order: [['published', 'DESC']],
      offset: req.query.offset,
      limit: req.query.limit
    })
      .then(data => res.status(200).send(data));
  } else {
    Doc.findAll({ order: [['published', 'DESC']],
      limit: req.query.limit,
      offset: req.query.offset,
      where: {
        $or: {
          ownerRoleId: token.userRoleId,
          access: 'public',
          $and: {
            access: 'private',
            ownerId: token.userId
          }
        }
      },
      attributes: [
        'id',
        'published',
        'title',
        'access',
        'content',
        'ownerId',
        'ownerRoleId'
      ]
    }).then(data => res.status(200).send(data)
    );
  }
};

/**
 * Search documents
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} all required documents
 */
module.exports.searchDocuments = (req, res) => {
  const token = req.token;
  let query;
  if (token.userRoleId === 1) {
    query = { ownerRoleId: req.query.ownerRoleId };
    if (req.query.date) {
      query.published = {
        $like: `%${req.query.date}%`
      };
    }
  } else {
    // return authorized If user is trying to search a different role;
    if (parseInt(req.query.ownerRoleId, 10) !== token.userRoleId) {
      return res.status(401).send({ message: 'Cannot Access document' });
    }
    query = {
      $or: {
        ownerRoleId: token.userRoleId,
        access: 'public',
        $and: {
          access: 'private',
          ownerId: token.userId
        }
      }
    };
    if (req.query.date) {
      query.published = {
        $like: `%${req.query.date}%`
      };
    }
  }
  Doc.findAll({ order: [['published', 'DESC']],
    limit: req.query.limit,
    where: query
  })
  .then((data) => {
    if (!data) {
      return res.status(404).send({ message: 'No Result Found' });
    }
    return res.status(200).send(data);
  });
};

/**
 * Delete a document
 * @param {object} req
 * @param {function} res // Object
 * @returns {promise} http response.
 */
module.exports.deleteDocument = (req, res) => {
  const token = req.token;
  Doc.find({
    where: {
      id: req.params.id
    }
  })
  .then((doc) => {
    if (!doc) {
      return res.status(404).send({ message: 'Document Not found' });
    }
    if ((token.ownerRoleId !== 1) && (token.userId !== doc.ownerId)) {
      return res.status(401).send({ message: 'Cannot access document' });
    }
  }).then(() => {
    Doc.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => res.status(200).send({ message: 'Document Removed' }));
  });
};
