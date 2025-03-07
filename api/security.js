const crypto = require('crypto');

// Function to generate a secure random key
function generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// AES encryption function
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES decryption function
function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Function to hash data using SHA-256
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to generate a secure token
function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

// Export the functions
module.exports = {
    generateSecretKey,
    encrypt,
    decrypt,
    hashData,
    generateToken
};