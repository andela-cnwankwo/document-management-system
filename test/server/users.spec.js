const expect = require('chai').expect;
const User = require('../../server/models/user');
const Document = require('../../server/methods/document-management.js');
const docMgt = new Document();

describe('Document Management System', () => {
  describe('User', () => {
    const newUser = {
      firstName: 'fakeFirstName',
      lastName: 'fakeLastName',
      username: 'fakeUsername',
      password: 'fakePassword',
      role: 'user',
    };

    it('Should create a new unique user', () => {
      docMgt.createUser(newUser);
      expect(docMgt.getUser(newUser.username).count()).to.equal(1);
    });
  });
});
