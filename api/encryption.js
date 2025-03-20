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

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
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

    const aLen = a.length;
    const bLen = b.length;
    let result = 0;

    if (aLen !== bLen) {
        return false;
    }

    for (let i = 0; i < aLen; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}

module.exports = { encrypt, decrypt, setEncryptionKey, generateEncryptionKey, safeCompare };