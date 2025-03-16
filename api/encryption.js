const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const encryptionKey = crypto.randomBytes(32); // Store securely in production!

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return iv.toString('hex') + ':' + authTag + ':' + encrypted;
}

function decrypt(encryptedData) {
    try {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const authTag = Buffer.from(parts.shift(), 'hex');
        const encryptedText = parts.join(':');

        const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return null; // Or throw an error, depending on your needs
    }
}

module.exports = { encrypt, decrypt, encryptionKey };