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

async function hashString(string, salt) {
  if (typeof string !== 'string' || string.length === 0) {
    throw new TypeError('String must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
    throw new TypeError('Salt must be a non-empty string.');
  }

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(string, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        console.error('Error during hashing:', err);
        return reject(new Error('Hashing failed.'));
      }
      resolve(derivedKey.toString('hex'));
    });
  });
}

async function verifyHash(string, hash, salt) {
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
    const computedHash = await hashString(string, salt);
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