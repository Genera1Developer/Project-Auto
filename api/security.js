const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use GCM for authenticated encryption
const key = crypto.randomBytes(32); // 256 bits - DO NOT STORE IN CODE. Use environment variables or a secure key management system.

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Initialization vector - generate per message
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag(); // Get the authentication tag

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex') // Include the authentication tag
    };
}

function decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedData = Buffer.from(text.encryptedData, 'hex');
    const authTag = Buffer.from(text.authTag, 'hex'); // Get the authentication tag

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag); // Set the authentication tag

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString();
}

function generateRandomKey(length = 32) { // Default to 256 bits
    return crypto.randomBytes(length).toString('hex');
}

module.exports = { encrypt, decrypt, generateRandomKey };