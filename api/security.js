const crypto = require('crypto');

const algorithm = 'aes-256-gcm';

// Function to generate a secure key
function generateKey() {
    return crypto.generateKeySync('aes', { length: 256 });
}

// Store the key securely (e.g., environment variable, key management system)
const key = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : generateKey();

function encrypt(text) {
    const iv = crypto.randomBytes(16); // GCM requires a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encryptedData, ivHex, authTagHex) {
    try {
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedData, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Or throw an error, depending on your error handling strategy
    }
}

module.exports = { encrypt, decrypt };