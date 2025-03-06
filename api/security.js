const crypto = require('crypto');

function generateRandomToken(length = 32) {
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error('Length must be a positive integer.');
  }
  return crypto.randomBytes(length).toString('hex');
}

function hashString(string, salt) {
  if (!string || typeof string !== 'string') {
    throw new Error('String must be a non-empty string.');
  }
  if (!salt || typeof salt !== 'string') {
    throw new Error('Salt must be a non-empty string.');
  }
  const hash = crypto.createHmac('sha512', salt);
  hash.update(string);
  return hash.digest('hex');
}

function verifyHash(string, hash, salt) {
  if (!string || typeof string !== 'string') {
    throw new Error('String must be a non-empty string.');
  }
    if (!hash || typeof hash !== 'string') {
    throw new Error('Hash must be a non-empty string.');
  }
  if (!salt || typeof salt !== 'string') {
    throw new Error('Salt must be a non-empty string.');
  }
  const computedHash = hashString(string, salt);
  return computedHash === hash;
}

module.exports = {
  generateRandomToken,
  hashString,
  verifyHash,
};