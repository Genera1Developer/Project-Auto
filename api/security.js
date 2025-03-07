const crypto = require('crypto');

async function generateRandomToken(length = 32) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('Length must be a positive integer.');
  }

  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        console.error('Error generating random token:', err);
        return reject(new Error('Failed to generate random token.'));
      }
      resolve(buffer.toString('hex'));
    });
  });
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
  if (typeof string !== 'string' || !string || typeof hash !== 'string' || !hash || typeof salt !== 'string' || !salt) {
    return false;
  }

  try {
    const computedHash = hashString(string, salt);
    if (computedHash.length !== hash.length) return false;
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