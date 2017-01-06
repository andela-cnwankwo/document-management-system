const expect = require('chai').expect;
const factory = require('../factory');
const sequelize = require('../test-helper');
const model = require('../../app/models');

let fakeRole;
describe('Document Management System', () => {
  // Before running tests, synchronize the tables
  before((done) => {
    sequelize.sync({}).then(() => {
      done();
    });
  });

  beforeEach(() => {
    fakeRole = factory.createRole();
  });

  it('should create a new role with title', (done) => {
    expect(fakeRole).to.include.keys('title');
    expect(model.Role.bulkCreate(fakeRole)).to.be.ok;
    done();
  });
});
