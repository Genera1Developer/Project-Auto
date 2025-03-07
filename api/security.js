const crypto = require('crypto');

// Function to generate a random salt
function generateSalt(length = 16) {
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error("Salt length must be a positive integer.");
  }
  return crypto.randomBytes(length).toString('hex');
}

// Function to hash a password using a salt
function hashPassword(password, salt) {
  if (!password || !salt) {
    throw new Error("Password and salt are required.");
  }
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
}

// Function to generate a secure random key
function generateSecureKey(length = 32) {
    if (length <= 0 || !Number.isInteger(length)) {
      throw new Error("Key length must be a positive integer.");
    }
    return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES-256-CBC
function encrypt(data, key) {
    if (!data || !key) {
      throw new Error("Data and key are required.");
    }

    try {
        const iv = crypto.randomBytes(16); // Initialization vector
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Encryption failed.");
    }
}

// Function to decrypt data using AES-256-CBC
function decrypt(text, key) {
    if (!text || !key) {
       throw new Error("Text and key are required.");
    }

    try {
        const textParts = text.split(':');
        if (textParts.length < 2) {
            throw new Error("Invalid ciphertext format.");
        }
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Decryption failed.");
    }
}

module.exports = {
  generateSalt,
  hashPassword,
  generateSecureKey,
  encrypt,
  decrypt
};