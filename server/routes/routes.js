const express = require('express');
const userService = require('../../server/services/user');

const router = express.Router();

// Setup default route
router.get('/', (req, res) => (res.status(200))
    ? res.status(200).send({
      message: 'Welcome to the Document Management App!'
    })
    : res.status(404));

router.route('/create-user')
  .post((req, res) => {
    userService.createUser(req.body, (data) => {
      return (data)
      ? res.status(200).send({ message: 'New User Created!' })
      : res.status(400).send({ message: 'User already exists' });
    });
    // if (query) {
    //   // res.status(data).send({ message: 'New User Created!' })
    //   console.log(query);
    // } else {
    //   console.log(query);
    // }


    // new Promise((resolve, reject) => {
    //   const query = userService.createUser(req.body);
    //   if (query) {
    //   // res.status(data).send({ message: 'New User Created!' })
    //     console.log(query);
    //     resolve(query);
    //   } else {
    //     console.log(query);
    //     reject(query);
    //   }
    // }).then((data) => {
    //   console.log(data);
    //   res.status(200).send({ message: 'New User Created!' });
    // })
    // .catch((data) => {
    //   console.log(data);
    //   res.status(400).send({ message: 'User already exists' });
    // });
  });
module.exports = router;
