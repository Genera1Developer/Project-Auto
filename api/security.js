const crypto = require('crypto');

// Generate a secure random key
function generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// AES Encryption
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES Decryption
function decrypt(text, key) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

// Generate a salt for password hashing
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Hash password using SHA256 with salt
function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
}

module.exports = {
    generateSecretKey,
    encrypt,
    decrypt,
    generateSalt,
    hashPassword
};