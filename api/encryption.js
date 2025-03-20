const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null;

function setEncryptionKey(newKey) {
    if (newKey && Buffer.isBuffer(newKey) && newKey.length === 32) {
        key = newKey;
    } else {
        throw new Error('Invalid key. Key must be a 32-byte Buffer.');
    }
}

function generateEncryptionKey() {
    key = crypto.randomBytes(32);
    return key.toString('hex');
}

function encrypt(text) {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(text) {
    try {
        if (!key) {
            throw new Error('Encryption key not set. Call setEncryptionKey() first.');
        }
        const iv = Buffer.from(text.iv, 'hex');
        const encryptedData = Buffer.from(text.encryptedData, 'hex');
        const authTag = Buffer.from(text.authTag, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

module.exports = { encrypt, decrypt, setEncryptionKey, generateEncryptionKey };