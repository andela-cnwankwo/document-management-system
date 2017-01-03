require('./connect');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('../server/routes/routes');
const jwt = require('jsonwebtoken');

const secret = 'documentmanagement';

// Initialize express app
const app = express();

// Define a middleware to handle request events and verify tokens.
app.use((req, res, next) => {
  console.log('A request has been made to the server');
  next();
  // const jwtcode = req.headers.authorization;
  // try {
  //   const token = jwt.verify(jwtcode, secret);
  //   return (token)
  //   ? next()
  //   : res.status(401).send({ message: 'User unauthorised!' });
  // } catch (e) {
  //   return res.status(401).send({ message: 'User unauthorised!' });
  // }
});

// log requests to the console
app.use(logger('dev'));

// Configure bodyParser to allow us get data from a post.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/', router);

module.exports = app;
