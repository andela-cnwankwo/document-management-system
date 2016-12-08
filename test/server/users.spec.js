// const expect = require('chai').expect;
// const User = require('../../server/models/user');
// const Document = require('../../server/methods/document-management.js');
// const docMgt = new Document();

import { expect } from 'chai';
import request from 'supertest';
import factory from '../factory';
import app from '../../settings/server';
import { sequelize } from '../test-helper';

describe('Document Management System', () => {
  // describe('User', () => {

  //   it('Should create a new unique user', () => {
  //     docMgt.createUser(newUser.user);
  //     expect(docMgt.getUser(newUser.user.username).count()).to.equal(1);
  //   });
  //   it('Verify that a new user created has a role defined', () => {
  //     expect(docMgt.getUser(newUser.user.username).rows[0].role).to.be.true;
  //   });
  //   it('Verify that a new user created has both first and last names', () => {
  //     expect(docMgt.getUser(newUser.user.username).rows[0].firstName).to.be.true;
  //     expect(docMgt.getUser(newUser.user.username).rows[0].lastName).to.be.true;
  //   });
  //   it('Should return all users when requested by the admin', () => {
  //     expect(docMgt.getAllUsers()).not.to.be.false;
  //   });
  // });
  // describe('Role', () => {

  // });
});
