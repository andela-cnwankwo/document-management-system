const faker = require('faker');

module.exports.createUser = () => {
  const first = faker.name.firstName(),
    last = faker.name.lastName(),
    roleID = 2;
  const fakeUser = {
    username: faker.internet.userName(),
    name: { first, last },
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: roleID
  };
  return fakeUser;
};

module.exports.createDocument = () => {
  const fakeDocument = {
    published: Date(),
    title: faker.lorem.word(),
    access: 'public',
    content: faker.lorem.sentences(),
    ownerId: 2,
    ownerRoleId: 2
  };
  return fakeDocument;
};

module.exports.createRole = () => {
  const fakeRole = {
    title: faker.lorem.word(),
  };
  return fakeRole;
};
