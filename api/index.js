
const serverless = require('serverless-http');
const app = require('../backend/server'); // path from api/index.js to backend/server.js

module.exports.handler = serverless(app);
