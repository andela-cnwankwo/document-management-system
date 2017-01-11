const expect = require('chai').expect;
const request = require('supertest');
const server = require('../../settings/app-config');

describe('Roles', () => {
  describe('Role', () => {
    it('should return unauthorised if no user token is specified', (done) => {
      request(server).get('/users/myusername').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorised!');
          done();
        });
    });

    it('should return unauthorised if user token is not correct', (done) => {
      request(server).get('/users/myusername')
      .set('Authorization', 'Authorization').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid Token, User unauthorised!');
          done();
        });
    });

    it('should return unauthorised if no admin token is specified', (done) => {
      request(server).get('/users').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorised!');
          done();
        });
    });

    it('should return unauthorised if admin token is not correct', (done) => {
      request(server).get('/users')
      .set('Authorization', 'Authorization').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid Token, User unauthorised!');
          done();
        });
    });
  });
});
