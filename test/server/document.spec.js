const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeDocument,
  fakeUser,
  fakeAdmin,
  testUser,
  testUserToken,
  fakeUserToken,
  fakeAdminToken;

describe('Document', () => {
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
      fakeDocument = factory.createDocument();
      fakeUser = factory.createUser();
      fakeAdmin = factory.createUser();
      fakeAdmin.roleId = 1;
      testUser = factory.createUser();
      request(server).post('/users').send(fakeAdmin)
        .then((res) => {
          fakeAdminToken = res.body.userToken;
          request(server).post('/users').send(fakeUser)
            .then((res) => {
              fakeUserToken = res.body.userToken;
              request(server).post('/users').send(testUser)
                .then((res) => {
                  testUserToken = res.body.userToken;
                  done();
                });
            });
        });
    });
  });

  describe('Create Document', () => {
    it('should create a document with published date defined', (done) => {
      request(server).post('/documents').send(fakeDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then((res) => {
            fakeDocument = res.body;
            expect(res.body.published).to.not.equal(undefined);
            done();
          });
    });

    it('should create a document with owner ', (done) => {
      request(server).get(`/documents/${fakeDocument.id}`)
      .set('Authorization', fakeUserToken)
        .expect(200)
          .then((res) => {
            expect(res.body.ownerId).to.not.equal(undefined);
            done();
          });
    });

    it('should not re-create a document that is already created', (done) => {
      const fakeDuplicateDocument = factory.createDocument();
      request(server).post('/documents').send(fakeDuplicateDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then(() => {
            request(server).post('/documents').send(fakeDuplicateDocument)
              .set('Authorization', fakeUserToken)
                .expect(409)
                  .then((res) => {
                    expect(res.body.message).to.equal('Document already exist');
                    done();
                  });
          });
    });

    it('should retrieve private documents if requested by owner', (done) => {
      const fakePrivateDocument = factory.createDocument();
      fakePrivateDocument.access = 'private';
      request(server).post('/documents').send(fakePrivateDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then((res) => {
            request(server).get(`/documents/${res.body.id}`)
            .set('Authorization', fakeUserToken).expect(200)
              .then(() => {
                done();
              });
          });
    });

    it('should return not found if document does not exist', (done) => {
      request(server).get('/documents/1000000000')
      .set('Authorization', fakeAdminToken).expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('should retrieve all documents if requested by the admin', (done) => {
      request(server).get('/documents')
      .set('Authorization', fakeAdminToken).expect(200)
        .then(() => {
          done();
        });
    });

    it('should retrieve all documents a user can access if not admin', (done) => {
      request(server).get('/documents')
      .set('Authorization', fakeUserToken).expect(200)
        .then(() => {
          done();
        });
    });

    it('should not return private documents if requested by another user', (done) => {
      const privateDocument = factory.createDocument();
      privateDocument.access = 'private';
      request(server).post('/documents').send(privateDocument)
      .set('Authorization', fakeAdminToken)
        .expect(201)
          .then((res) => {
            request(server).get(`/documents/${res.body.id}`)
            .set('Authorization', fakeUserToken).expect(401)
              .then((response) => {
                expect(response.body.message).to.equal('Cannot Access private document');
                done();
              });
          });
    });

    it('should return documents with role access if requested by user of same role', (done) => {
      const fakeRoleDocument = factory.createDocument();
      fakeRoleDocument.access = 'role';
      request(server).post('/documents').send(fakeRoleDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then((res) => {
            request(server).get(`/documents/${res.body.id}`)
            .set('Authorization', testUserToken).expect(200)
              .then(() => {
                done();
              });
          });
    });

    it('should not return documents if requested by user of another role', (done) => {
      const fakeRoleDocument = factory.createDocument();
      fakeRoleDocument.access = 'role';
      request(server).post('/documents').send(fakeRoleDocument)
      .set('Authorization', fakeAdminToken)
        .expect(201)
          .then((res) => {
            request(server).get(`/documents/${res.body.id}`)
            .set('Authorization', testUserToken).expect(401)
              .then((response) => {
                expect(response.body.message).to.equal('Cannot Access document');
                done();
              });
          });
    });

    it('Should return documents limited by a number', (done) => {
      const limit = 2;
      request(server).get(`/documents/all/${limit}`)
      .set('Authorization', fakeAdminToken).expect(200)
        .then(() => {
          done();
        });
    });

    it('Should return documents limited by a number and a given offset', (done) => {
      const limit = 2;
      const offset = 1;
      request(server).get(`/documents/all/${offset}/${limit}`)
      .set('Authorization', fakeAdminToken).expect(200)
        .then(() => {
          done();
        });
    });

    describe('Search Documents', () => {
      it('Should return documents limited by a number given a criteria and created by a specified role', (done) => {
        const limit = 2;
        const roleId = 2;
        request(server).get(`/documents/find/${limit}/${roleId}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then(() => {
            done();
          });
      });

      it('Should not return documents from the admin role to a regular user', (done) => {
        const limit = 2;
        const roleId = 1;
        request(server).get(`/documents/find/${limit}/${roleId}`)
        .set('Authorization', fakeUserToken).expect(401)
          .then((res) => {
            expect(res.body.message).to.equal('Cannot Access document');
            done();
          });
      });

      it('Should return documents from the admin role to an admin user', (done) => {
        const limit = 2;
        const roleId = 1;
        request(server).get(`/documents/find/${limit}/${roleId}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(() => {
            done();
          });
      });

      it('Should return documents created on a specified date', (done) => {
        request(server).get(`/documents/find/1/1/${Date().substr(0, 15)}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(() => {
            done();
          });
      });

      it('Should return search results limited by a number ', (done) => {
        const limit = 1;
        request(server).get(`/documents/find/${limit}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(() => {
            done();
          });
      });
    });
  });
});
