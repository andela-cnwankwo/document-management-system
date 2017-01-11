//  Defines various services for the role object

const Sequelize = require('sequelize');
// Require sequelize from the connection settings
const sequelize = require('../../settings/connect');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'documentmanagement';

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
  const jwtcode = req.headers.authorization;
  const token = jwt.verify(jwtcode, secret);
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
    .spread((doc, created) => (created)
        ? res.status(201).send(doc)
        : res.status(409).send({ message: 'Document already exist' }));
};

/**
 * Get created document
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified document.
 */
module.exports.getDocument = (req, res) => {
  const jwtcode = req.headers.authorization;
  const token = jwt.verify(jwtcode, secret);
  Doc.find({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'published', 'title', 'access', 'content', 'ownerId', 'ownerRoleId']
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
    if (data && token.userRoleId === data.dataValues.ownerRoleId && data.access === 'role') {
      return res.status(200).send(data);
    }
    return res.status(401).send({ message: 'Cannot Access document' });
  });
};

/**
 * Get created document
 * @param {object} req
 * @param {function} res // Object
 * @returns {object} specified document.
 */
module.exports.getAllDocuments = (req, res) => {
  const jwtcode = req.headers.authorization;
  const token = jwt.verify(jwtcode, secret);
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
          .then(data => res.status(200).send(data));
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
          attributes: ['id', 'published', 'title', 'access', 'content', 'ownerId', 'ownerRoleId']
        }).then(data => res.status(200).send(data)
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
      attributes: ['id', 'published', 'title', 'access', 'content', 'ownerId', 'ownerRoleId']
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
  const jwtcode = req.headers.authorization;
  const token = jwt.verify(jwtcode, secret);
  let query;
  if (token.userRoleId === 1) {
    query = { ownerRoleId: req.query.ownerRoleId };
    if (req.query.date) {
      query.published = {
        $like: `%${req.query.date}%`
      };
    }
  } else {
    // If the user is trying to search a different role level, return unauthorised;
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
  .then(data => (data)
    ? res.status(200).send(data)
    : res.status(404).send({ message: 'No Result Found' }));
};
