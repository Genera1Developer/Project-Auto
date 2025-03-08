const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null; // Initialize key as null

function setEncryptionKey(newKey) {
    if (newKey && newKey.length === 32) {
        key = Buffer.from(newKey); // Expects a Buffer
    } else {
        throw new Error('Invalid encryption key provided. Key must be a 32-byte Buffer.');
    }
}

function encrypt(text) {
    if (!key) {
        throw new Error('Encryption key not initialized. Call setEncryptionKey() first.');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encryptedData) {
    if (!key) {
        throw new Error('Encryption key not initialized. Call setEncryptionKey() first.');
    }
    try {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const encryptedText = Buffer.from(encryptedData.encryptedData, 'hex');
        const authTag = Buffer.from(encryptedData.authTag, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt, setEncryptionKey };