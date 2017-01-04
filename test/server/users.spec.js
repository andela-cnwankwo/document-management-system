const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');
const jwt = require('jsonwebtoken');

let fakeUser;
let token;
let headers;
const secret = 'documentmanagement';

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
      request(server).post('/users').send({ fakeUser }).expect(201)
        .then((res) => {
          token = res.userToken;
          done();
        });
    });

    it('should create a unique user', (done) => {
      request(server).post('/users').send({ fakeUser }).expect(201)
        .then(() => {
          request(server).post('/users').send({ fakeUser }).expect(400)
            .then((res) => {
              expect(res.body.message).to.equal('User already exists');
              done();
            });
        });
    });

    it('should create users with default role of regular', (done) => {
      request(server).post('/users').send({ fakeUser }).expect(201)
        .then((res) => {
          request(server).get(`/users/${fakeUser.username}`)
            .set('Authorization', `${res.body.userToken}`).expect(200)
              .then((res) => {
                expect(res.body.roleId).to.equal(2);
                done();
              });
        });
    });

    // it('should create users with both first and last names', (done) => {
    //   request(server).post('/users').send({ user: fakeUser }).expect(200)
    //     .then(() => {
    //       request(server).get('/users/email').send({ user: fakeUser })
    //         .expect(200)
    //           .then((res) => {
    //             expect(res.body.user.name.first).to.equal(fakeUser.name.first);
    //             expect(res.body.user.name.last).to.equal(fakeUser.name.last);
    //             done();
    //           });
    //     });
    // });

    // it('should return all users if the current user has an admin role',
    //   (done) => {
    //     const fakeAdmin = fakeUser;
    //     fakeAdmin.roleId = 1;
    //     request(server).post('/users').send({ user: fakeAdmin }).expect(200)
    //       .then(() => {
    //         request(server)
    //           .get(`/users?username=${fakeAdmin.username}&password=${fakeAdmin.password}`)
    //             .expect(200)
    //         .then((res) => {
    //           expect(res.body.message).to.equal('Query Successful!');
    //           // TODO: display all registered users, response set temporarily to 'Query Successful!'
    //           done();
    //         });
    //       });
    //   }
    // );

    // it('should return unauthorised if the user is not an admin', (done) => {
    //   request(server).post('/users').send({ user: fakeUser }).expect(200)
    //     .then(() => {
    //       request(server)
    //         .get(`/users?username=${fakeUser.username}&password=${fakeUser.password}`)
    //           .expect(401)
    //       .then((res) => {
    //         expect(res.body.message).to.equal('User unauthorised!');
    //         done();
    //       });
    //     });
    // });
  });
});
