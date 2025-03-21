const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

let deriveKeySalt = null;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha512';

function setDeriveKeySalt(salt) {
    deriveKeySalt = salt;
}

function deriveEncryptionKey(password) {
    if (!deriveKeySalt) {
        throw new Error('Derive key salt not set.');
    }

    key = crypto.pbkdf2Sync(password, deriveKeySalt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
}

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

function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    const maxLength = Math.max(a.length, b.length);
    if (maxLength > 512) {
        return false;
    }

    let result = true;
    for (let i = 0; i < maxLength; i++) {
        const charCodeA = a.charCodeAt(i) || 0;
        const charCodeB = b.charCodeAt(i) || 0;
        result &= (charCodeA === charCodeB);
    }
    return result;
}

module.exports = {
    encrypt,
    decrypt,
    setEncryptionKey,
    generateEncryptionKey,
    safeCompare,
    deriveEncryptionKey,
    setDeriveKeySalt
};