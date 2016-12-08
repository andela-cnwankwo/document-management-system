require('./connect');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

// Initialize express app
const app = express();

// log requests to the console
app.use(logger('dev'));

// Configure bodyParser to allow us get data from a post.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Define a default route
app.get('/', (req, res) => {
  return (res.status(200))
    ? res.status(200).send({ message: 'Welcome to the Document Management App!'})
    : res.status(404);
});

module.exports = app;

