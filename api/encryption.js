const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Use a stronger, authenticated encryption algorithm
const key = crypto.randomBytes(32); // Generate a secure key (32 bytes for AES-256)

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag
    };
}

function decrypt(encryptedData) {
    try {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const authTag = Buffer.from(encryptedData.authTag, 'hex');
        const encryptedText = encryptedData.encryptedData;

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption Error:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

function generateContentDigest(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

module.exports = { encrypt, decrypt, generateContentDigest };