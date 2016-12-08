// const bluebird = require('bluebird');
// const factoryGirl = require('factory-girl');
const sequelize = require('./test-helper');
const faker = require('faker');
const User = require('../app/models/user');

// const factory = factoryGirl.promisify(bluebird);

module.exports.createFakeUser = () => sequelize.define('user', User, {
  userId: () => faker.random.uuid(),
  firstname: () => faker.name.firstName(),
  lastname: () => faker.name.lastName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  role: () => faker.name.jobTitle
});
