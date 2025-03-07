const crypto = require('crypto');

function generateRandomKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function verifyPassword(enteredPassword, passwordHash, salt) {
  const newHash = crypto.createHmac('sha512', salt);
  newHash.update(enteredPassword);
  const value = newHash.digest('hex');
  return passwordHash === value;
}

module.exports = {
  generateRandomKey,
  hashPassword,
  generateSalt,
  verifyPassword
};