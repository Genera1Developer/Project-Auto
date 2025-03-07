const crypto = require('crypto');

// Function to generate a secure random key
function generateSecretKey(length = 32) {
    if (length <= 0) {
        throw new Error("Key length must be a positive integer.");
    }
    return crypto.randomBytes(length).toString('hex');
}

// AES encryption function with authenticated encryption (GCM)
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
}

// AES decryption function with authenticated decryption (GCM)
function decrypt(text, key) {
    const textParts = text.split(':');
    if (textParts.length !== 3) {
        throw new Error("Invalid ciphertext format.");
    }
    const iv = Buffer.from(textParts[0], 'hex');
    const authTag = Buffer.from(textParts[1], 'hex');
    const encryptedText = Buffer.from(textParts[2], 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Function to hash data using SHA-256
function hashData(data) {
    if (typeof data !== 'string') {
        data = JSON.stringify(data); // Ensure data is a string
    }
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to generate a secure token
function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

// Function to generate a secure random salt
function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to hash password with salt using PBKDF2
function hashPassword(password, salt) {
    const iterations = 10000;
    const keyLength = 64;
    const digest = 'sha512';
    const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');
    return hashedPassword;
}

// Export the functions
module.exports = {
    generateSecretKey,
    encrypt,
    decrypt,
    hashData,
    generateToken,
    generateSalt,
    hashPassword
};