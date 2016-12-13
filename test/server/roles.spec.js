const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;

describe('Roles', () => {
  before((done) => {
    sequelize.sync({ }).then(() => {
      done();
    });
  });

  beforeEach(() => {
    fakeUser = factory.createUser();
  });

  describe('Role', () => {
    it('should only create unique role if the user is an admin', (done) => {
      const fakeAdmin = fakeUser;
      fakeAdmin.roleId = 1;
      request(server).post('/users').send({
        user: fakeAdmin
      }).expect(200)
        .then(() => {
          request(server).post('/roles')
            .send({
              user: {
                username: fakeAdmin.username,
                password: fakeAdmin.password
              },
              newrole: {
                title: 'admin'
              }
            }).expect(200)
            .then((res) => {
              expect(res.body.message).to.equal('Role Updated!');
              done();
            });
        });
    });

    // it('should not create role if the user is not an admin', (done) => {
    //   request(server).post('/users').send({
    //     user: fakeUser
    //   }).expect(200)
    //     .then(() => {
    //       request(server).post('/roles')
    //         .send({
    //           user: {
    //             username: fakeUser.username,
    //             password: fakeUser.password
    //           },
    //           newrole: {
    //             title: 'regular'
    //           }
    //         }).expect(401)
    //         .then((res) => {
    //           expect(res.body.message).to.equal('User unauthorized!');
    //           done();
    //         });
    //     });
    // });

    it('should return all the roles if the roles route is specified', (done) => {
      request(server).get('/roles').expect(200)
        .then(() => {
          done();
        });
    });

    it('should have at least admin and regular roles created', (done) => {
      request(server).get('/roles?title=admin').expect(200)
        .then((res) => {
          expect(res.body.message).to.equal('Role exists!');
        });
      request(server).get('/roles?title=regular').expect(200)
        .then((res) => {
          expect(res.body.message).to.equal('Role exists!');
          done();
        });
    });
  });
});
