const crypto = require('crypto');

function generateRandomToken(length = 32) {
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
  if (typeof string !== 'string' || string.length === 0) {
    throw new TypeError('String must be a non-empty string.');
  }
  if (typeof salt !== 'string' || salt.length === 0) {
    throw new TypeError('Salt must be a non-empty string.');
  }

  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHmac('sha512', salt);
      hash.update(string);
      const digest = hash.digest('hex');
      if (!digest) {
        return reject(new Error('Hashing failed: Digest is empty'));
      }
      resolve(digest);
    } catch (error) {
      console.error('Error during hashing:', error);
      reject(new Error('Hashing failed.'));
    }
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
    const computedHashBuffer = Buffer.from(computedHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');

    if (computedHashBuffer.length !== hashBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedHashBuffer, hashBuffer);
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