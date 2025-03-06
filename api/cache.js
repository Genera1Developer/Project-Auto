const NodeCache = require( "node-cache" );

const stdTTL = 60 * 60; // 1 hour
const checkperiod = 60 * 5; // 5 minutes

const cache = new NodeCache( { stdTTL: stdTTL, checkperiod: checkperiod } );

module.exports = cache;