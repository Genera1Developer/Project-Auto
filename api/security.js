const crypto = require('crypto');

// AES encryption function
function aesEncrypt(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES decryption function
function aesDecrypt(data, key) {
    const textParts = data.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Generate a random AES key
function generateAesKey() {
    return crypto.randomBytes(32).toString('hex'); // 256-bit key
}

// Generate a secure random token
function generateSecureToken() {
    return crypto.randomBytes(64).toString('hex'); // 512-bit token
}

// Hash data using SHA-256
function sha256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
    aesEncrypt,
    aesDecrypt,
    generateAesKey,
    generateSecureToken,
    sha256Hash
};