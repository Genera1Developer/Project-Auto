const crypto = require('crypto');

// Function to generate a secure random key
function generateRandomKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to hash data using SHA-256
function hashData(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

// Function to encrypt data using AES-256-CBC
function encryptData(data, key) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data using AES-256-CBC
function decryptData(encryptedData, key) {
    const [iv, encrypted] = encryptedData.split(':');
    const ivBuffer = Buffer.from(iv, 'hex');
    const encryptedBuffer = Buffer.from(encrypted, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), ivBuffer);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    generateRandomKey,
    hashData,
    encryptData,
    decryptData
};