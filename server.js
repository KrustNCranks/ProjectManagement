const http = require('http');
const app = require('./app');

// Use an environment variable port , if not present in the server/system, defaul at 3001
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);