const expect = require('chai').expect;
const factory = require('../factory');
const sequelize = require('../test-helper');
const model = require('../../app/models');

const fakeUser = factory.createUser();
describe('Document Management System', () => {
  // Before running tests, synchronize the tables
  before((done) => {
    sequelize.sync({}).then(done())
  });

  it('should create a new user with username, name, email, password, and roleId fields', (done) => {
    expect(fakeUser).to.include.keys(['username', 'name', 'email', 'password', 'roleId']);
    expect(model.User.bulkCreate(fakeUser)).to.be.ok;
    done();
  });
});
