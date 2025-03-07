const crypto = require('crypto');

// AES encryption function with error handling
function aesEncrypt(data, key) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error("Encryption error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

// AES decryption function with error handling
function aesDecrypt(data, key) {
    try {
        if (!data) {
            return null; // Or throw an error if an empty data is considered an error.
        }

        const textParts = data.split(':');
        if (textParts.length < 2) {
            console.error("Invalid ciphertext format.");
            return null;
        }

        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
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