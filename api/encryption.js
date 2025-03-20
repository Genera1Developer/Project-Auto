const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

function setEncryptionKey(newKey) {
    if (!Buffer.isBuffer(newKey) || newKey.length !== KEY_LENGTH) {
        throw new Error(`Invalid key. Key must be a ${KEY_LENGTH}-byte Buffer.`);
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

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    let encrypted;

    try {
        encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }

    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString('base64'),
        encryptedData: encrypted.toString('base64'),
        authTag: authTag.toString('base64')
    };
}

function decrypt(text) {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    try {
        const iv = Buffer.from(text.iv, 'base64');
        const encryptedData = Buffer.from(text.encryptedData, 'base64');
        const authTag = Buffer.from(text.authTag, 'base64');

        const decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

const SAFE_COMPARE_MAX_LENGTH = 512;

function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    if (a.length > SAFE_COMPARE_MAX_LENGTH || b.length > SAFE_COMPARE_MAX_LENGTH) {
        return false;
    }

    try {
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch (error) {
        return false;
    }
}

module.exports = { encrypt, decrypt, setEncryptionKey, generateEncryptionKey, safeCompare };