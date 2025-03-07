const crypto = require('crypto');

// Function to generate a secure random key
function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES
function encrypt(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data using AES
function decrypt(data, key) {
  const textParts = data.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Function to hash data using SHA256
function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
  generateSecureKey,
  encrypt,
  decrypt,
  hashData,
};