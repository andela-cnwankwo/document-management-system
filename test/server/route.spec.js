const expect = require('chai').expect;
const app = require('../../settings/server');
const request = require('supertest');

describe('Routes', () => {
  describe('Landing Page', () => {
    it('Should return a 200 status when the home page is loaded', () => {
      request(app).get('/').expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Welcome to the Document Management App!');
      });
    });
  });
});
