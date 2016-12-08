const bluebird = require('bluebird');
const factoryGirl = require('factory-girl');
const faker = require('faker');
const User = require('../app/models/User');

const factory = factoryGirl.promisify(bluebird);

factory.define('user', User, {
  firstname: () => faker.name.firstName(),
  lastname: () => faker.name.lastName(),
  username: () => faker.internet.userName(),
  password: () => faker.internet.password(),
  role: () => faker.name.jobTitle
});

module.exports = factory;
