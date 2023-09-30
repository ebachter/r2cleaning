require('source-map-support').install();

process.title = 'R2/Jobs';

module.exports = require('./dist/worker');
