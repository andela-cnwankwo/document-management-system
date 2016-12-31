const faker = require('faker');
const model = require('../../app/models');

/**
 * seedData class to generate test user data
 */
class seedData {

  /**
   * @method constructor
   */
  constructor() {
    this.model = model;
  }

  /**
   * Initialize the order of running the seed.
   * @returns {void}
   */
  init() {
    this.model.sequelize.sync({ force: true })
      .then(() => {
        this.seedRoles()
          .then(() => {
            this.seedUsers()
              .then(() => {
                this.seedDocuments();
              })
              .catch(err => console.log(`seed documents error: ${err}`));
          })
          .catch(err => console.log(`seed users error: ${err}`));
      })
      .catch(err => console.log(`seed roles error: ${err}`));
  }

  /**
   * Creates roles in the database
   * @method seedRoles
   * @returns {object} roles data
   */
  seedRoles() {
    const roles = [
      {
        title: 'admin'
      },
      {
        title: 'regular'
      }
    ];
    return this.models.Role.bulkCreate(roles);
  }

  /**
   * Create users in the database
   * @method seedUsers
   * @returns {object} users data
   */
  seedUsers() {
    const users = [
      {
        username: faker.internet.userName(),
        name: { first: faker.name.firstName(), last: faker.name.lastName() },
        email: 'admin@dms.com',
        password: faker.internet.password(),
        roleId: 1
      },
      {
        username: faker.internet.userName(),
        name: { first: faker.name.firstName(), last: faker.name.lastName() },
        email: 'user@dms.com',
        password: faker.internet.password(),
        roleId: 2
      },
      {
        username: faker.internet.userName(),
        name: { first: faker.name.firstName(), last: faker.name.lastName() },
        email: faker.internet.email(),
        password: faker.internet.password(),
        roleId: 2
      }
    ];
    return this.model.User.bulkCreate(users);
  }

  /**
   * Create documents in the database
   * @method seedDocuments
   * @returns {object} documents data
   */
  seedDocuments() {
    const documents = [
      {
        published: Date(),
        title: faker.lorem.word(),
        access: 'public',
        content: faker.lorem.sentences(),
        ownerId: 2
      },
      {
        published: Date(),
        title: faker.lorem.word(),
        access: 'private',
        content: faker.lorem.sentences(),
        ownerId: 2
      },
      {
        published: Date(),
        title: faker.lorem.word(),
        access: 'private',
        content: faker.lorem.sentences(),
        ownerId: 1
      },
      {
        published: Date(),
        title: faker.lorem.word(),
        access: 'role',
        content: faker.lorem.sentences(),
        ownerId: 1
      }
    ];
    return this.model.Doc.bulkCreate(documents);
  }
}

export default new seedData().init();
