// const expect = require('chai').expect;
// const User = require('../../server/models/user');
// const Document = require('../../server/methods/document-management.js');
// const docMgt = new Document();

const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const app = require('../../settings/server');
const sequelize = require('../test-helper');

describe('Document Management System', () => {
  before((done) => {
    sequelize.sync().then(() => {
      done();
    });
  });

  describe('User', () => {
    it('should create a new user when given the correct details', (done) => {
      const user = factory.buildSync('user');
      request(app).post('/users').send({ user }).expect(200)
        .then((res) => {
          expect(res.body.user).to.be.an('object');
          done();
        });
    });

    it('should not create a user that already exists', (done) => {
      const user = factory.buildSync('user');
      request(app).post('/users').send({ user }).expect(200)
        .then(() => {
          request(app).post('/users').send({ user }).expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('User already exists');
              done();
            });
        });
    });

  //   it('Should create a new unique user', () => {
  //     docMgt.createUser(newUser.user);
  //     expect(docMgt.getUser(newUser.user.username).count()).to.equal(1);
  //   });
  //   it('Verify that a new user created has a role defined', () => {
  //     expect(docMgt.getUser(newUser.user.username).rows[0].role).to.be.true;
  //   });
  //   it('Verify that a new user created has both first and last names', () => {
  //     expect(docMgt.getUser(newUser.user.username).rows[0].firstName).to.be.true;
  //     expect(docMgt.getUser(newUser.user.username).rows[0].lastName).to.be.true;
  //   });
  //   it('Should return all users when requested by the admin', () => {
  //     expect(docMgt.getAllUsers()).not.to.be.false;
  //   });
  });
  // describe('Role', () => {

  // });
});
