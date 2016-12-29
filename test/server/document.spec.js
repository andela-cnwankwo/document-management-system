const expect = require('chai').expect;
const request = require('supertest');
const factory = require('../factory');
const server = require('../../settings/app-config');
const sequelize = require('../test-helper');


let fakeUser;
let currentUser;
let fakeDocument;

describe('Document', () => {
  before((done) => {
    sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach((done) => {
    fakeDocument = factory.createDocument();
    fakeUser = factory.createUser();
    request(server).post('/users').send({ user: fakeUser })
      .then(() => {
        request(server).get('/users/email').send({ user: fakeUser })
          .then((res) => {
            currentUser = res.body.user;
            done();
          });
      });
  });

  describe('Create Document', () => {
    it('should create a document with published date defined', (done) => {
      fakeDocument.ownerId = currentUser.id;
      request(server).post('/documents').send({ document: fakeDocument })
      .expect(200)
        .then((res) => {
          expect(res.body.published).to.equal(fakeDocument.published);
          done();
        });
    });

    it('should create a document with access as public by default ', (done) => {
      request(server).post('/documents').send({ document: fakeDocument })
      .expect(200)
        .then((res) => {
          expect(res.body.access).to.equal('public');
          done();
        });
    });

    it('should only retrieve private documents if requested by owner', (done) => {
      fakeDocument.ownerId = currentUser.id;
      request(server).post('/documents').send({ document: fakeDocument })
      .expect(200)
        .then(() => {
          request(server).get(`/documents?ownerId=${currentUser.id}`).expect(200)
            .then(() => {
              done();
            });
        });
    });
  });
});
