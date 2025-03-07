const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use GCM for authenticated encryption
const key = crypto.randomBytes(32); // 256-bit key (must be securely stored and managed)

// Function to encrypt data using AES-GCM
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Initialization vector (must be unique for each encryption)
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

// Function to decrypt data using AES-GCM
function decrypt(encryptedDataHex, ivHex, authTagHex) {
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Function to generate a secure random token
function generateToken(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to hash data using SHA-256
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
    encrypt,
    decrypt,
    generateToken,
    hashData
};