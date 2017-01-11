const expect = require('chai').expect;
const request = require('supertest');

describe('Routes', () => {
  let server;
  beforeEach(() => {
    server = require('../../settings/app-config');
  });
  afterEach((done) => {
    server.close(done);
  });
  describe('Default route', () => {
    it('Should return a 200 status when the default route is called', (done) => {
      request(server).get('/').expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Welcome to the Document Management App!');
        done();
      });
    });
  });
});
