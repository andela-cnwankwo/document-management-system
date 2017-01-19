const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');

let fakeDocument = factory.createDocument(),
  fakeUser = factory.createUser(),
  testUser = factory.createUser(),
  fakeAdmin = factory.createUser(),
  fakeRoleDocument = factory.createDocument(),
  fakePrivateDocument = factory.createDocument(),
  newDocument = factory.createDocument(),
  newDocumentId,
  fakeUserToken,
  fakeAdminToken,
  testUserToken,
  fakeRoleDocumentId,
  fakePrivateDocumentId;

describe('Document', () => {
  // Before running tests, drop all tables and recreate them
  // Create a default user and a default admin
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
      fakeAdmin.roleId = 1;
      fakeRoleDocument.access = 'role';
      fakePrivateDocument.access = 'private';
      request(server).post('/users').send(fakeAdmin)
        .then((res) => {
          fakeAdminToken = res.body.userToken;
          request(server).post('/users').send(fakeUser)
            .then((res) => {
              fakeUserToken = res.body.userToken;
              request(server).post('/users').send(testUser)
                .then((res) => {
                  testUserToken = res.body.userToken;
                  request(server).post('/documents').send(newDocument)
                    .set('Authorization', fakeUserToken)
                      .then((res) => {
                        newDocumentId = res.body.id;
                        done();
                      });
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

    it('should create a document with access set to public by default', 
    (done) => {
      const publicDocument = factory.createDocument();
      request(server).get(`/documents/${newDocumentId}`)
      .set('Authorization', fakeUserToken)
        .expect(200).then((res) => {
          expect(res.body.access).to.equal('public');
          done();
        });
    });

    it('should update a document if requested by the admin', (done) => {
      request(server).put(`/documents/${newDocumentId}`).send({
        title: 'NewTitle',
        access: 'private',
        content: 'New updated document'
      })
      .set('Authorization', fakeAdminToken).expect(200)
        .then((response) => {
          expect(response.body.message).to.equal('Document Updated!');
          done();
        });
    });

    it('should update a document if requested by the owner', (done) => {
      request(server).put(`/documents/${newDocumentId}`).send({
        title: 'NewTitle1',
        access: 'private1',
        content: 'New updated document1'
      })
      .set('Authorization', fakeUserToken).expect(200)
        .then((response) => {
          expect(response.body.message).to.equal('Document Updated!');
          done();
        });
    });

    it('should not update a document if requested by another user', (done) => {
      request(server).put(`/documents/${newDocumentId}`).send({
        title: 'NewTitle',
        access: 'private',
        content: 'New updated document'
      })
      .set('Authorization', testUserToken).expect(401)
        .then((response) => {
          expect(response.body.message)
            .to.equal('Cannot Access document');
          done();
        });
    });

    it('should return not found if document to update does not exist', 
    (done) => {
        request(server).put('/documents/9000010').send({
          title: 'NewTitle',
          access: 'private',
          content: 'New updated document'
        })
        .set('Authorization', fakeAdminToken).expect(404)
          .then((res) => {
            expect(res.body.message).to.equal('Document not found');
            done();
          });
    });

    it('should create a document with ownerId ', (done) => {
      request(server).get(`/documents/${fakeDocument.id}`)
      .set('Authorization', fakeUserToken)
        .expect(200)
          .then((res) => {
            expect(res.body.ownerId).to.not.equal(undefined);
            done();
          });
    });

    it('should not re-create a document that is already created', (done) => {
      request(server).post('/documents').send(fakeDocument)
        .set('Authorization', fakeUserToken)
          .expect(409)
            .then((res) => {
            expect(res.body.message).to.equal('Document already exist');
            done();
            });
    });

    it('should retrieve private documents if requested by owner', (done) => {
      request(server).post('/documents').send(fakePrivateDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then((res) => {
            fakePrivateDocumentId = res.body.id;
            request(server).get(`/documents/${fakePrivateDocumentId}`)
            .set('Authorization', fakeUserToken).expect(200)
              .then(done());
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
        .then(done());
    });

    it('should retrieve all documents a user can access if not admin', 
    (done) => {
      request(server).get('/documents')
      .set('Authorization', fakeUserToken).expect(200)
        .then(done());
    });

    it('should not return private documents if requested by another user',
    (done) => {
      request(server).get(`/documents/${fakePrivateDocumentId}`)
      .set('Authorization', testUserToken).expect(401)
        .then((response) => {
          expect(response.body.message).to.equal('Cannot Access document');
          done();
        });
    });

    it('should return documents if requested by owner', (done) => {
      request(server).post('/documents').send(fakeRoleDocument)
      .set('Authorization', fakeUserToken)
        .expect(201)
          .then((res) => {
            fakeRoleDocumentId = res.body.id;
            request(server).get(`/documents/${fakeRoleDocumentId}`)
            .set('Authorization', fakeUserToken).expect(200)
              .then(done());
          });
    });

    it('should return documents if requested by Admin', (done) => {
      request(server).get(`/documents/${fakeRoleDocumentId}`)
      .set('Authorization', fakeAdminToken).expect(200)
        .then(done());
    });

    it('should return documents if requested by user of same role', (done) => {
      request(server).get(`/documents/${fakeRoleDocumentId}`)
      .set('Authorization', testUserToken).expect(200)
        .then(done());
    });

    it('Should return documents limited by a number', (done) => {
      const limit = 2;
      request(server).get(`/documents?limit=${limit}`)
      .set('Authorization', fakeAdminToken).expect(200)
        .then(done());
    });

    it('Should return documents limited by a number and a given offset', 
    (done) => {
      const limit = 2;
      const offset = 1;
      request(server).get(`/documents?offset=${offset}&limit=${limit}`)
      .set('Authorization', fakeAdminToken).expect(200)
        .then(done());
    });

    describe('Search Documents', () => {
      it('Should return documents given a criteria and created by a role',
      (done) => {
        const limit = 2;
        const roleId = 2;
        request(server).get(`/documents?limit=${limit}&ownerRoleId=${roleId}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then(done());
      });

      it('Should not return documents from the admin role to a regular user', 
      (done) => {
        const limit = 2;
        const roleId = 1;
        request(server)
        .post(`/documents/find?limit=${limit}&ownerRoleId=${roleId}`)
        .set('Authorization', fakeUserToken).expect(401)
          .then((res) => {
            expect(res.body.message).to.equal('Cannot Access document');
            done();
          });
      });

      it('Should return documents from the admin role to an admin user',
      (done) => {
        const limit = 2;
        const roleId = 1;
        request(server)
        .post(`/documents/find?limit=${limit}&ownerRoleId=${roleId}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(done());
      });

      it('Should return documents created on a specified date', (done) => {
        const limit = 1, roleId = 1, date = Date().substr(0, 15);
        request(server)
        .post(`/documents/find?limit=${limit}&ownerRoleId=${roleId}&date=${date}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(done());
      });

      it('Should return search results limited by a number ', (done) => {
        const limit = 1;
        request(server).post(`/documents/find?limit=${limit}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(done());
      });

      it('Should return all documents of specified user if requested by admin',
      (done) => {
        request(server).get(`/documents?username=${fakeUser.username}`)
        .set('Authorization', fakeAdminToken).expect(200)
          .then(done());
      });

      it('Should return all documents of specified user accessible to the user',
      (done) => {
        request(server).get(`/documents?username=${fakeUser.username}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then(done());
      });

      it('Should delete a document if requested by the owner', (done) => {
        request(server).delete(`/documents/${newDocumentId}`)
        .set('Authorization', fakeUserToken).expect(200)
          .then(done());  
      });
    });
  });
});
