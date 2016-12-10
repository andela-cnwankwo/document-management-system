const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;

describe('Document Management System', () => {
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
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
          request(server).get('/users/email').send({ user: fakeUser })
            .expect(200)
              .then((res) => {
                expect(res.body.user.username).to.equal(fakeUser.username);
                done();
              });
        });
    });

    it('should create users with default roleId of 2', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then(() => {
          request(server).get('/users/email').send({ user: fakeUser })
            .expect(200)
              .then((res) => {
                expect(res.body.user.roleId).to.equal(2);
                done();
              });
        });
    });

    it('should create users with both first and last names', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then(() => {
          request(server).get('/users/email').send({ user: fakeUser })
            .expect(200)
              .then((res) => {
                expect(res.body.user.name.first).to.equal(fakeUser.name.first);
                expect(res.body.user.name.last).to.equal(fakeUser.name.last);
                done();
              });
        });
    });

    it('should return all users if the current user has an admin role',
      (done) => {
        const fakeAdmin = fakeUser;
        fakeAdmin.roleId = 1;
        request(server).post('/users').send({ user: fakeAdmin }).expect(200)
          .then(() => {
            request(server)
              .get(`/users?username=${fakeAdmin.username}&password=${fakeAdmin.password}`)
                .expect(200)
            .then((res) => {
              expect(res.body.message).to.equal('Query Successful!');
              // TODO: display all registered users, response set temporarily to 'Query Successful!'
              done();
            });
          });
      }
    );

    it('should return unauthorised if the user is not an admin', (done) => {
      request(server).post('/users').send({ user: fakeUser }).expect(200)
        .then(() => {
          request(server)
            .get(`/users?username=${fakeUser.username}&password=${fakeUser.password}`)
              .expect(401)
          .then((res) => {
            expect(res.body.message).to.equal('User unauthorised!');
            done();
          });
        });
    });
  });
});
