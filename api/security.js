const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null; // Initialize key as null

function setEncryptionKey(newKey) {
    if (!newKey || typeof newKey !== 'string' || newKey.length !== 32) {
        throw new Error('Invalid encryption key provided. Key must be a 32-character string.');
    }
    try {
        key = Buffer.from(newKey, 'utf8');
    } catch (error) {
        throw new Error('Error creating Buffer from key: ' + error.message);
    }
}

function encrypt(text) {
    if (!key) {
        throw new Error('Encryption key not initialized. Call setEncryptionKey() first.');
    }
    if (typeof text !== 'string') {
        throw new TypeError('Expected text to encrypt to be a string');
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

    if (!encryptedData || typeof encryptedData !== 'object' || !encryptedData.iv || !encryptedData.encryptedData || !encryptedData.authTag) {
        console.error("Invalid encrypted data format.");
        return null;
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

// Key rotation function - generates a new key and updates the key variable.
function rotateEncryptionKey() {
    const newKey = crypto.randomBytes(32).toString('hex'); // Generate a new random key (64 hex characters = 32 bytes)
    setEncryptionKey(newKey);
    console.log('Encryption key rotated successfully.');
    return newKey; //Return the new key.
}

module.exports = { encrypt, decrypt, setEncryptionKey, rotateEncryptionKey };