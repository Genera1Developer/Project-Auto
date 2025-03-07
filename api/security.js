const crypto = require('crypto');

function generateRandomKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return {
    salt: salt,
    passwordHash: hash.digest('hex')
  };
}

function verifyPassword(password, salt, passwordHash) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const computedHash = hash.digest('hex');
  return computedHash === passwordHash;
}

module.exports = {
  generateRandomKey,
  hashPassword,
  verifyPassword
};