// const expect = require('chai').expect;
// const request = require('supertest');
// const factory = require('../factory');
// const server = require('../../settings/app-config');
// const sequelize = require('../test-helper');


// let fakeUser;
// let currentUser;
// let fakeDocument;

// describe('Document', () => {
//   // Before running tests, drop all tables and recreate them
//   before((done) => {
//     sequelize.sync({ force: true }).then(() => {
//       done();
//     });
//   });

//   beforeEach((done) => {
//     fakeDocument = factory.createDocument();
//     fakeUser = factory.createUser();
//     request(server).post('/users').send({ user: fakeUser })
//       .then(() => {
//         request(server).get('/users/email').send({ user: fakeUser })
//           .then((res) => {
//             currentUser = res.body.user;
//             fakeDocument.ownerId = res.body.user.id;
//             done();
//           });
//       });
//   });

//   describe('Create Document', () => {
//     it('should create a document with published date defined', (done) => {
//       request(server).post('/documents').send({ document: fakeDocument })
//       .expect(200)
//         .then((res) => {
//           expect(res.body.published).to.equal(fakeDocument.published);
//           done();
//         });
//     });

//     it('should create a document with access as public by default ', (done) => {
//       request(server).post('/documents').send({ document: fakeDocument })
//       .expect(200)
//         .then((res) => {
//           expect(res.body.access).to.equal('public');
//           done();
//         });
//     });

//     it('should only retrieve private documents if requested by owner', (done) => {
//       fakeDocument.access = 'private';
//       request(server).post('/documents').send({ document: fakeDocument })
//       .expect(200)
//         .then(() => {
//           request(server).get(`/documents?ownerId=${currentUser.id}`).expect(200)
//             .then(() => {
//               done();
//             });
//         });
//     });

    // it('should not retrieve private documents if requested by another user', (done) => {
    //   fakeDocument.access = 'private';
    //   request(server).post('/documents').send({ document: fakeDocument })
    //   .expect(200)
    //     .then(() => {
    //       request(server).get(`/documents?ownerId=${currentUser.id + 1}`).expect(401)
    //         .then(() => {
    //           done();
    //         });
    //     });
    // });
  // describe('Search Documents', () => {
  //   it('Should return documents limited by a number given a criteria and created by a specified role', (done) => {
  //     request(server).get('/documents/find/1/1').expect(200)
  //       .then(() => {
  //         done();
  //       });
  //   });

  //   it('Should return documents created on a specified date', (done) => {
  //     request(server).get(`/documents/find/1/1/${Date().substr(0, 15)}`).expect(200)
  //       .then(() => {
  //         done();
  //       });
  //   });
  // });
//   });
// });
