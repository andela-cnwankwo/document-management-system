const expect = require('chai').expect;
const factory = require('../factory');
const sequelize = require('../test-helper');
const model = require('../../app/models');

let fakeDocument;
describe('Document Management System', () => {
  // Before running tests, synchronize the tables
  before((done) => {
    sequelize.sync({}).then(done())
  });

  beforeEach((done) => {
    fakeDocument = factory.createDocument();
    done();
  });

  it('should create a new document with ownerId', (done) => {
    expect(fakeDocument).to.include.keys(['published', 'title', 'access', 'ownerId', 'ownerRoleId']);
    expect(model.Doc.bulkCreate(fakeDocument)).to.be.ok;
    done();
  });
});
