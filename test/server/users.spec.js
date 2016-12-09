const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;

describe('Document Management System', () => {
  before((done) => {
    sequelize.sync().then(() => {
      done();
    });
  });

  beforeEach(() => {
    fakeUser = factory.createUser();
  });

  describe('User', () => {
    it('should create a new user', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then((res) => {
          expect(res.body.message).to.equal('New User Created!');
          done();
        });
    });

    it('should not create a user that already exists', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then(() => {
          request(server).post('/users').send({ user: fakeUser }).expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('User already exists');
              done();
            });
        });
    });

    it('should create a unique user', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then(() => {
          request(server).get('/users/email').send({ user: fakeUser }).expect(200)
            .then((res) => {
              expect(res.body.user.username).to.equal(fakeUser.username);
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
