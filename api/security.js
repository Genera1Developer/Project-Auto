const crypto = require('crypto');

function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function hashString(string, salt) {
  if (!string || !salt) {
    throw new Error('String and salt are required for hashing.');
  }
  const hash = crypto.createHmac('sha512', salt);
  hash.update(string);
  return hash.digest('hex');
}

function verifyHash(string, hash, salt) {
  const computedHash = hashString(string, salt);
  return computedHash === hash;
}

module.exports = {
  generateRandomToken,
  hashString,
  verifyHash,
};