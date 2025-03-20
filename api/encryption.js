const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null;

function setEncryptionKey(newKey) {
    if (!Buffer.isBuffer(newKey) || newKey.length !== 32) {
        throw new Error('Invalid key. Key must be a 32-byte Buffer.');
    }
    key = newKey;
}

function generateEncryptionKey() {
    const newKey = crypto.generateKeySync('aes', { length: 256 });
    key = newKey;
    return newKey.toString('hex');
}

function encrypt(text) {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv, {authTagLength: 16});
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('base64'),
        encryptedData: encrypted.toString('base64'),
        authTag: authTag.toString('base64')
    };
}

function decrypt(text) {
    try {
        if (!key) {
            throw new Error('Encryption key not set. Call setEncryptionKey() first.');
        }
        const iv = Buffer.from(text.iv, 'base64');
        const encryptedData = Buffer.from(text.encryptedData, 'base64');
        const authTag = Buffer.from(text.authTag, 'base64');

        const decipher = crypto.createDecipheriv(algorithm, key, iv, {authTagLength: 16});
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    try {
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch (error) {
        return false;
    }
}

module.exports = { encrypt, decrypt, setEncryptionKey, generateEncryptionKey, safeCompare };