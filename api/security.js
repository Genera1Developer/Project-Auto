const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Generate a secure key
const iv = crypto.randomBytes(16); // Generate a secure IV

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function generateSecureToken() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = {
    encrypt,
    decrypt,
    generateSecureToken,
    key // Export the key (for demonstration purposes only - NEVER DO THIS IN PRODUCTION)
};