// API Service For Microservices

require('source-map-support').install();

process.title = 'R2/API';

module.exports = require('./dist/server');
