const expect = require('chai').expect;
const factory = require('../factory');
const request = require('supertest');
const sequelize = require('../test-helper');
const server = require('../../settings/app-config');
const model = require('../../app/models');

let fakeUser;
let fakeUserToken;
let fakeDocument;
describe('Document Management System', () => {
  // Before running tests, synchronize the tables
  before((done) => {
    sequelize.sync({ }).then(() => {
      fakeUser = factory.createUser();
      request(server).post('/users').send(fakeUser)
        .then((res) => {
          fakeUser = res.body.user;    // Reassign fakeuser to the created user data
          fakeUserToken = res.body.userToken;
          done();
        });
    });
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
