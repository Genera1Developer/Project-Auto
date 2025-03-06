const crypto = require('crypto');

function generateRandomToken(length = 32) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('Length must be a positive integer.');
  }
  try {
    const token = crypto.randomBytes(length).toString('hex');
    if (!token) {
      throw new Error('Failed to generate token.');
    }
    return token;
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
    const digest = hash.digest('hex');
    if (!digest) {
        throw new Error('Hashing failed: Digest is empty');
    }
    return digest;
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
    if (!computedHash) {
      return false;
    }

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