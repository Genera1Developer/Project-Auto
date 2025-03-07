const crypto = require('crypto');

// Function to generate a secure random key
const generateKey = (length) => {
    if (length <= 0) {
        throw new Error("Key length must be greater than zero.");
    }
    return crypto.randomBytes(length).toString('hex');
};

// AES encryption function
const encrypt = (text, key) => {
    if (!text || !key) {
        throw new Error("Text and key are required for encryption.");
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const ciphertext = iv.toString('hex') + ':' + encrypted.toString('hex');
    return ciphertext;
};

// AES decryption function
const decrypt = (ciphertext, key) => {
    if (!ciphertext || !key) {
        throw new Error("Ciphertext and key are required for decryption.");
    }

    try {
        const textParts = ciphertext.split(':');
        if (textParts.length !== 2) {
            throw new Error("Invalid ciphertext format.");
        }
        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Decryption failed: " + error.message);
    }
};

module.exports = {
    generateKey,
    encrypt,
    decrypt
};