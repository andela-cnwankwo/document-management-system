require('./connect');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

// Check if this is a test environment and set the port as random(undefined)
const port = (process.env.NODE_ENV === 'test')
  ? process.env.PORT || 3000
  : undefined;

// Configure bodyParser to allow us get data from a post.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Define a default route
app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.listen(port);
console.log(`App started, listening on port ${port}`);

