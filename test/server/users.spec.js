const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;
let fakeAdmin;
let fakeUserToken;
let fakeAdminToken;

describe('Document Management System', () => {
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
      fakeUser = factory.createUser();
      fakeAdmin = factory.createUser();
      fakeAdmin.roleId = 1;
      request(server).post('/users').send(fakeAdmin)
        .then((res) => {
          fakeAdminToken = res.body.userToken;
          request(server).post('/users').send(fakeUser)
            .then((res) => {
              fakeUserToken = res.body.userToken;
              done();
            });
        });
    });
  });

  describe('User', () => {
    it('should create a new user', (done) => {
      const newUser = factory.createUser();
      request(server).post('/users').send(newUser).expect(201)
        .then(() => {
          done();
        });
    });

    it('should create a unique user', (done) => {
      const uniqueUser = factory.createUser();
      request(server).post('/users').send(uniqueUser).expect(201)
        .then((res) => {
          fakeUserToken = res.body.userToken;
          request(server).post('/users').send(uniqueUser).expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('User already exists');
              done();
            });
        });
    });

    it('should create users with default role of regular', (done) => {
      request(server).get(`/users/${fakeUser.username}`)
        .set('Authorization', `${fakeUserToken}`).expect(200)
          .then((res) => {
            expect(res.body.roleId).to.equal(2);
            done();
          });
    });

    it('should return 404 when the user is not found', (done) => {
      request(server).get('/users/fakeUser.username.not.found')
        .set('Authorization', `${fakeUserToken}`).expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('User not Found');
            done();
          });
    });

    it('should create users with both first and last names', (done) => {
      request(server).get(`/users/${fakeUser.username}`)
        .set('Authorization', `${fakeUserToken}`).expect(200)
          .then((res) => {
            expect(res.body.name.first).to.equal(fakeUser.name.first);
            expect(res.body.name.last).to.equal(fakeUser.name.last);
            done();
          });
    });

    it('should login a registered user', (done) => {
      request(server)
      .get(`/login?username=${fakeUser.username}&password=${fakeUser.password}`)
        .expect(200)
          .then(() => {
            done();
          });
    });

    it('should logout a user', (done) => {
      request(server).get('/logout').expect(200)
        .then(() => {
          done();
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
        request(server)
          .get('/users').set('Authorization', `${fakeAdminToken}`)
            .expect(200)
              .then(() => {
                done();
              });
      }
    );

    it('should return unauthorised if the user is not an admin', (done) => {
      request(server)
        .get('/users').set('Authorization', `${fakeUserToken}`).expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorised! login as admin');
          done();
        });
    });

    it('should update a users information', (done) => {
      request(server)
        .put(`/users/${fakeUser.username}`).send({
          email: 'Ethanet@email.com',
          name: {
            first: 'ethan',
            last: 'nwankwo'
          },
          password: 'ethan',
          roleId: 1
        }).set('Authorization', `${fakeUserToken}`)
          .expect(200)
            .then(() => {
              done();
            });
    });

    it('should return not found for an unknown user', (done) => {
      request(server)
        .put('/users/invalid.app.username').send({
          email: 'Ethanet@email.com',
          name: {
            first: 'ethan',
            last: 'nwankwo'
          },
          password: 'ethan',
          roleId: 1
        }).set('Authorization', `${fakeUserToken}`)
          .expect(404)
            .then(() => {
              done();
            });
    });

    it('should delete a user if requested by admin', (done) => {
      request(server)
        .delete(`/users/${fakeAdmin.username}`)
          .set('Authorization', `${fakeAdminToken}`)
            .expect(200)
              .then(() => {
                done();
              });
    });

    it('should return not found for an unknown user', (done) => {
      request(server)
        .delete('/users/delete.invalid_user')
          .set('Authorization', `${fakeAdminToken}`)
            .expect(404)
              .then(() => {
                done();
              });
    });
  });
});
