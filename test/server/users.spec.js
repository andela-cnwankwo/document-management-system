const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;

describe('Document Management System', () => {
  // Before running tests, drop all tables and recreate them
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
      request(server).post('/users').send(fakeUser).expect(201)
        .then(() => {
          done();
        });
    });

    it('should create a unique user', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then(() => {
          request(server).post('/users').send(fakeUser).expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('User already exists');
              done();
            });
        });
    });

    it('should create users with default role of regular', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then((res) => {
          request(server).get(`/users/${fakeUser.username}`)
            .set('Authorization', `${res.body.userToken}`).expect(200)
              .then((res) => {
                expect(res.body.roleId).to.equal(2);
                done();
              });
        });
    });

    it('should return 404 when the user is not found', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then((res) => {
          request(server).get('/users/fakeUser.username.not.found')
            .set('Authorization', `${res.body.userToken}`).expect(404)
              .then((res) => {
                expect(res.body.message).to.equal('User not Found');
                done();
              });
        });
    });

    it('should create users with both first and last names', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then((res) => {
          request(server).get(`/users/${fakeUser.username}`)
            .set('Authorization', `${res.body.userToken}`).expect(200)
              .then((res) => {
                expect(res.body.name.first).to.equal(fakeUser.name.first);
                expect(res.body.name.last).to.equal(fakeUser.name.last);
                done();
              });
        });
    });

    it('should login a registered user', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then(() => {
          request(server)
          .get(`/login?username=${fakeUser.username}&password=${fakeUser.password}`)
            .expect(200)
              .then(() => {
                done();
              });
        });
    });

    it('should return error if no login details is specified', (done) => {
      request(server).get('/login').expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid request, specify username and password');
          done();
        });
    });

    it('should return not found if user is not registered', (done) => {
      request(server).get("/login?username=''&password=''").expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return all users if the current user has an admin role',
      (done) => {
        const fakeAdmin = fakeUser;
        fakeAdmin.roleId = 1;
        request(server).post('/users').send(fakeAdmin).expect(201)
          .then((res) => {
            request(server)
              .get('/users').set('Authorization', `${res.body.userToken}`)
                .expect(200)
                  .then(() => {
                    done();
                  });
          });
      }
    );

    it('should return unauthorised if the user is not an admin', (done) => {
      request(server).post('/users').send(fakeUser).expect(201)
        .then((res) => {
          request(server)
            .get('/users').set('Authorization', `${res.body.userToken}`)
              .expect(401)
          .then((res) => {
            expect(res.body.message).to.equal('User unauthorised! login as admin');
            done();
          });
        });
    });
  });
});
