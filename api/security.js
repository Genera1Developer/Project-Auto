const crypto = require('crypto');

function generateRandomToken(length = 32) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Length must be a positive integer.');
  }
  return crypto.randomBytes(length).toString('hex');
}

function hashString(string, salt) {
  if (typeof string !== 'string' || string.length === 0) {
    throw new Error('String must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
    throw new Error('Salt must be a non-empty string.');
  }
  const hash = crypto.createHmac('sha512', salt);
  hash.update(string);
  return hash.digest('hex');
}

function verifyHash(string, hash, salt) {
  if (typeof string !== 'string' || string.length === 0) {
    throw new Error('String must be a non-empty string.');
  }
  if (typeof hash !== 'string' || hash.length === 0) {
    throw new Error('Hash must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
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