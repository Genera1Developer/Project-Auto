// api/encryption.js

const crypto = require('crypto');

// Function to generate a secure random key with specified length
function generateSecureKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES-256-GCM
function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data using AES-256-GCM
function decryptData(encryptedData, key) {
    const textParts = encryptedData.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Function to generate a SHA-256 hash
function generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to generate a salt for password hashing
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Function to hash a password with salt
function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return {
        salt: salt,
        hashedPassword: hashedPassword
    };
}

// Function to verify a password against a stored hash and salt
function verifyPassword(password, salt, hashedPassword) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const passwordAttemptHash = hash.digest('hex');
    return passwordAttemptHash === hashedPassword;
}

module.exports = {
    generateSecureKey,
    encryptData,
    decryptData,
    generateHash,
    generateSalt,
    hashPassword,
    verifyPassword
};