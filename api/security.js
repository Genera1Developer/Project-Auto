const crypto = require('crypto');

// Function to generate a random salt
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to hash a password using a salt
function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
}

// Function to generate a secure random key
function generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES-256-CBC
function encrypt(data, key) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data using AES-256-CBC
function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
  generateSalt,
  hashPassword,
  generateSecureKey,
  encrypt,
  decrypt
};