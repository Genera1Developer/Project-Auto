const crypto = require('crypto');

const KEY_LENGTH = 32; // Define constant for key length
const SALT_LENGTH = 16; // Define constant for salt length
const HASH_ALGORITHM = 'sha512'; // Define constant for hash algorithm

function generateRandomKey(length = KEY_LENGTH) {
  if (length <= 0) {
    throw new Error("Key length must be positive.");
  }
  return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
  if (!password || !salt) {
    throw new Error("Password and salt must be provided.");
  }
  const hash = crypto.createHmac(HASH_ALGORITHM, salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
}

function generateSalt(length = SALT_LENGTH) {
    if (length <= 0) {
        throw new Error("Salt length must be positive.");
    }
  return crypto.randomBytes(length).toString('hex');
}

function verifyPassword(enteredPassword, passwordHash, salt) {
  if (!enteredPassword || !passwordHash || !salt) {
    throw new Error("Entered password, password hash, and salt must be provided.");
  }
  const newHash = crypto.createHmac(HASH_ALGORITHM, salt);
  newHash.update(enteredPassword);
  const value = newHash.digest('hex');
  return passwordHash === value;
}

function encrypt(text, key) {
    if (!text || !key) {
        throw new Error("Text and key must be provided for encryption.");
    }
    const iv = crypto.randomBytes(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    if (!text || !key) {
        throw new Error("Text and key must be provided for decryption.");
    }
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
  generateRandomKey,
  hashPassword,
  generateSalt,
  verifyPassword,
  encrypt,
  decrypt
};