require('./connect');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('../server/routes/routes');
const jwt = require('jsonwebtoken');

const secret = 'documentmanagement';

// Initialize express app
const app = express();

// Define a middleware to handle request events.
app.use((req, res, next) => {
  console.log('A request has been made to the server');
  // const jwtcode = req.headers.authorization;
  // const token = jwt.verify(jwtcode, secret);
  // console.log(` JWTCode: ${jwtcode}`);
  next();
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

