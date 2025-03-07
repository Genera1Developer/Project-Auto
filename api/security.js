const crypto = require('crypto');

async function generateRandomToken(length = 32) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('Length must be a positive integer.');
  }

  try {
    const buffer = await crypto.randomBytes(length);
    return buffer.toString('hex');
  } catch (err) {
    console.error('Error generating random token:', err);
    throw new Error('Failed to generate random token.');
  }
}

function hashString(string, salt) {
  if (!string || typeof string !== 'string') {
    throw new TypeError('String must be a non-empty string.');
  }
  if (!salt || typeof salt !== 'string') {
    throw new TypeError('Salt must be a non-empty string.');
  }

  try {
    const derivedKey = crypto.pbkdf2Sync(string, salt, 100000, 64, 'sha512');
    return derivedKey.toString('hex');
  } catch (err) {
    console.error('Error during hashing:', err);
    throw new Error('Hashing failed.');
  }
}

function verifyHash(string, hash, salt) {
  if (!string || typeof string !== 'string' || !hash || typeof hash !== 'string' || !salt || typeof salt !== 'string') {
    return false;
  }

  try {
    const computedHash = hashString(string, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));

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