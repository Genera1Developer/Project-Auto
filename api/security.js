// api/security.js

const crypto = require('crypto');

// Generate a secure random key
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
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or throw the error if you prefer
    }
}

// Hash data using SHA256
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to generate a secure random token
function generateSecureToken(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to securely compare strings to prevent timing attacks
function secureCompare(string1, string2) {
    try {
        return crypto.timingSafeEqual(Buffer.from(string1, 'utf8'), Buffer.from(string2, 'utf8'));
    } catch (error) {
        console.error("Secure compare error:", error);
        return false; // Or handle the error as needed
    }
}

module.exports = {
    generateSecretKey,
    encrypt,
    decrypt,
    hashData,
    generateSecureToken,
    secureCompare
};