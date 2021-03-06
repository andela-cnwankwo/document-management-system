const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeUser,
  fakeAdmin,
  newUser,
  fakeUserToken,
  fakeAdminToken,
  fakeUserId,
  fakeAdminId;

describe('Document Management System', () => {
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
      fakeUser = factory.createUser();
      fakeAdmin = factory.createUser();
      newUser = factory.createUser();
      fakeAdmin.roleId = 1;
      request(server).post('/users').send(fakeAdmin)
        .then((res) => {
          fakeAdminToken = res.body.userToken;
          fakeAdminId = res.body.user.id;
          request(server).post('/users').send(fakeUser)
            .then((res) => {
              fakeUserToken = res.body.userToken;
              fakeUserId = res.body.user.id;
              done();
            });
        });
    });
  });

  describe('User', () => {
    it('should create a new user', (done) => {
      request(server).post('/users').send(newUser).expect(201)
        .then((res) => {
          expect(res.body.user).to.have.property('roleId');
          done();
        });
    });

    it('should create a unique user', (done) => {
      request(server).post('/users').send(newUser).expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('User already exists');
          done();
        });
    });

    it('should not create a user if role does not exist', (done) => {
      invalidRoleUser = factory.createUser();
      invalidRoleUser.roleId = 9000010;
      request(server).post('/users').send(invalidRoleUser).expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid roleId specified');
          done();
        });
    });

    it('should login a registered user', (done) => {
      // Default admin account seeded into the database.
      request(server).post('/login')
      .send({ username: 'admin', password: 'admin'})
      .expect(200)
        .then(done());
    });

    it('should return error for login if password is incorrect', (done) => {
      // Default admin account seeded into the database.
      request(server).post('/login')
      .send({ username: 'admin', password: 'wrongpassword'})
      .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid username or password');
          done();
        });
    });

    it('should create users with default role of regular', (done) => {
      request(server).get(`/users/${fakeUserId}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then((res) => {
            expect(res.body).to.have.property('roleId');
            expect(res.body.roleId).to.equal(2);
            done();
          });
    });

    it('should return 404 when the user is not found', (done) => {
      request(server).get('/users/80099890')
        .set('Authorization', fakeUserToken).expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('User not Found');
            done();
          });
    });

    it('should create users with both first and last names', (done) => {
      request(server).get(`/users/${fakeUserId}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then((res) => {
            expect(res.body.name.first).to.equal(fakeUser.name.first);
            expect(res.body.name.last).to.equal(fakeUser.name.last);
            done();
          });
    });

    it('should login a registered user', (done) => {
      request(server)
      .post("/login")
      .send({ username: fakeUser.username, password: fakeUser.password })
        .expect(200)
          .then(done());
    });

    it('should logout a user', (done) => {
      request(server).post('/logout').expect(200)
        .then(done());
    });

    it('should return error if no login details is specified', (done) => {
      request(server).post('/login').expect(400)
        .then((res) => {
          expect(res.body.message)
            .to.equal('Invalid request, specify username and password');
          done();
        });
    });

    it('should return not found if user is not registered', (done) => {
      request(server).post("/login").send({ username: "", password: "" })
      .expect(400)
        .then((res) => {
          expect(res.body.message)
            .to.equal('Invalid request, specify username and password');
          done();
        });
    });

    it('should return all users if the current user has an admin role',
      (done) => {
        request(server)
          .get('/users').set('Authorization', fakeAdminToken)
            .expect(200)
              .then(done());
      }
    );

    it('should update a users information', (done) => {
      request(server)
        .put(`/users/${fakeUserId}`).send({
          email: 'Ethanet@email.com',
          name: {
            first: 'ethan',
            last: 'nwankwo'
          },
          password: 'ethan',
          roleId: 1
        }).set('Authorization', fakeUserToken)
          .expect(200)
            .then(done());
    });

    it('should return unauthorised if the user is not an admin', (done) => {
      request(server)
        .get('/users').set('Authorization', fakeUserToken).expect(401)
        .then((res) => {
        expect(res.body.message).to.equal('User unauthorised! login as admin');
        done();
        });
    });

    it('should return 404 response if user detail is not found', (done) => {
      request(server)
        .put('/users/9067854').send({
          email: 'Ethanet@email.com',
          name: {
            first: 'ethan',
            last: 'nwankwo'
          },
          password: 'ethan',
          roleId: 1
        }).set('Authorization', fakeUserToken)
          .expect(404)
            .then(done());
    });

    it('should delete a user if requested by admin', (done) => {
      request(server)
        .delete(`/users/${fakeAdminId}`)
          .set('Authorization', fakeAdminToken)
            .expect(200)
              .then(done());
    });

    it('should return 404 if no user record is found to delete', (done) => {
      request(server)
        .delete('/users/900100')
          .set('Authorization', fakeAdminToken)
            .expect(404)
              .then(done());
    });
  });
});
