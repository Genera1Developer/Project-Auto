const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use GCM for authenticated encryption
const key = crypto.randomBytes(32); // Generate a secure key (32 bytes for AES-256)

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.generateAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex')
    };
}

function decrypt(encryptedData, ivHex, authTagHex) {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function generateSecureToken() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = {
    encrypt,
    decrypt,
    generateSecureToken
};