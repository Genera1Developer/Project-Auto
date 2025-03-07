const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use GCM for authentication
const key = crypto.randomBytes(32); // Generate a secure key
// No IV needed for key generation.  IV is dynamically generated for each encryption.

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + authTag.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.shift(), 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt
};