const crypto = require('crypto');

function generateRandomToken(length = 32) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('Length must be a positive integer.');
  }
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    console.error('Error generating random token:', error);
    throw new Error('Failed to generate random token.');
  }
}

function hashString(string, salt) {
  if (typeof string !== 'string' || string.length === 0) {
    throw new TypeError('String must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
    throw new TypeError('Salt must be a non-empty string.');
  }

  try {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(string);
    return hash.digest('hex');
  } catch (error) {
    console.error('Error during hashing:', error);
    throw new Error('Hashing failed.');
  }
}

function verifyHash(string, hash, salt) {
  if (typeof string !== 'string' || string.length === 0) {
    throw new TypeError('String must be a non-empty string.');
  }
  if (typeof hash !== 'string' || hash.length === 0) {
    throw new TypeError('Hash must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
    throw new TypeError('Salt must be a non-empty string.');
  }

  try {
    const computedHash = hashString(string, salt);
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch (error) {
    console.error('Error during hash verification:', error);
    return false;
  }
}

module.exports = {
  generateRandomToken,
  hashString,
  verifyHash,
};