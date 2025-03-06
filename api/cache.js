const NodeCache = require( "node-cache" );

const stdTTL = 60 * 60 * 24; // 24 hours
const checkperiod = 60 * 60; // 1 hour

const cache = new NodeCache( { stdTTL: stdTTL, checkperiod: checkperiod } );

module.exports = cache;