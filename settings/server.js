require('./connect');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('../server/routes/routes');

// Initialize express app
const app = express();

// log requests to the console
app.use(logger('dev'));

// Configure bodyParser to allow us get data from a post.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/', router);

module.exports = app;

