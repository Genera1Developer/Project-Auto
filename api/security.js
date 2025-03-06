const crypto = require('crypto');

function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function hashString(string, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(string);
  return hash.digest('hex');
}

module.exports = {
  generateRandomToken,
  hashString,
};