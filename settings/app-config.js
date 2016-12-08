const http = require('http'),
  app = require('./server');

// Check if this is a test environment and set the port as random(undefined)
const port = (process.env.NODE_ENV !== 'test')
  ? process.env.PORT || 3000
  : 8080;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
