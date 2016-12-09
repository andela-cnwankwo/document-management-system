// const bluebird = require('bluebird');
// const factoryGirl = require('factory-girl');
// const sequelize = require('./test-helper');
const faker = require('faker');
// const User = require('../app/models/user');

// const factory = factoryGirl.promisify(bluebird);
module.exports.createUser = () => {
  const first = faker.name.firstName(),
    last = faker.name.lastName();
  const fakeUser = {
    username: faker.internet.userName(),
    name: { first, last },
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  return fakeUser;
};
