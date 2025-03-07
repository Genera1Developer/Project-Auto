const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Use a strong, modern algorithm
const key = crypto.randomBytes(32); // 256-bit key (must be securely stored and managed)
const iv = crypto.randomBytes(16); // Initialization vector (must be unique for each encryption)

// Function to encrypt data using AES
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Function to decrypt data using AES
function decrypt(text, ivHex) {
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
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