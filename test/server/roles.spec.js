const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser;
let fakeAdmin;
let fakeUserToken;
let fakeAdminToken;


describe('Roles', () => {
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

  describe('Role', () => {
    it('should only create unique role if the user is an admin', (done) => {
      const fakeRole = factory.createRole();
      request(server).post('/roles')
      .send(fakeRole)
        .set('Authorization', fakeAdminToken)
        .expect(201)
          .then((res) => {
            expect(res.body.message).to.equal('Role Added!');
            done();
          });
    });

    it('should not create role if the user is not an admin', (done) => {
      const fakeRole = factory.createRole();
      request(server).post('/roles')
        .send(fakeRole)
          .set('Authorization', fakeUserToken)
          .expect(401)
            .then((res) => {
              expect(res.body.message)
                .to.equal('User unauthorised! login as admin');
              done();
            });
    });

    it('should return all the roles if the user is an admin', (done) => {
      request(server).get('/roles/all')
      .set('Authorization', fakeAdminToken).expect(200)
        .then(done());
    });

    it('should have at least admin and regular roles created', (done) => {
      request(server).get('/roles/1')
      .set('Authorization', fakeAdminToken).expect(200)
        .then(() => {
          request(server).get('/roles/2')
          .set('Authorization', fakeAdminToken).expect(200)
            .then(() => {
              done();
            });
        });
    });

    it('should not create unique roles', (done) => {
      request(server).post('/roles')
      .send({ title: 'admin' })
        .set('Authorization', fakeAdminToken)
        .expect(400)
          .then((res) => {
            expect(res.body.message).to.equal('Role Already Exists!');
            done();
          });
    });

    it('should return not found if role does not exist', (done) => {
      request(server).get('/roles/1000000')
      .set('Authorization', fakeAdminToken).expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Role Not found');
          done();
        });
    });
  });
});
