const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
let key = null;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

let deriveKeySalt = null;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha512';

// Use a singleton pattern to ensure key is only generated/derived once.
let keyGenerated = false;

// Flag to indicate if key derivation is being used
let keyDerivationUsed = false;

// Store initialization vector to prevent reuse
let lastIV = null;

// Cache the cipher for potential performance improvement.
let cachedCipher = null;
let cachedDecipher = null;

function setDeriveKeySalt(salt) {
    deriveKeySalt = salt;
}

function deriveEncryptionKey(password) {
    if (keyGenerated) {
        return; // Key already generated.
    }
    if (!deriveKeySalt) {
        throw new Error('Derive key salt not set.');
    }

    try {
        key = crypto.pbkdf2Sync(password, deriveKeySalt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
        keyGenerated = true;
        keyDerivationUsed = true; //Mark that key derivation was used
        cachedCipher = null; // Invalidate cached cipher on key change
        cachedDecipher = null; // Invalidate cached decipher on key change
    } catch (error) {
        console.error("Key derivation failed:", error);
        throw new Error('Key derivation failed. Check password and salt.');
    }
}

function setEncryptionKey(newKey) {
    if (keyGenerated) {
        return; // Key already generated.
    }
    if (!Buffer.isBuffer(newKey) || newKey.length !== KEY_LENGTH) {
        throw new Error(`Invalid key. Key must be a ${KEY_LENGTH}-byte Buffer.`);
    }
    key = newKey;
    keyGenerated = true;
    keyDerivationUsed = false; //Explicitly set to false when directly setting the key
    cachedCipher = null; // Invalidate cached cipher on key change
    cachedDecipher = null; // Invalidate cached decipher on key change
}

function generateEncryptionKey() {
    if (keyGenerated) {
        return key.toString('hex'); // Key already generated, return existing.
    }
    try {
        const newKey = crypto.generateKeySync('aes', { length: 256 });
        key = newKey;
        keyGenerated = true;
        keyDerivationUsed = false; //Explicitly set to false when generating key
        cachedCipher = null; // Invalidate cached cipher on key change
        cachedDecipher = null; // Invalidate cached decipher on key change
        return newKey.toString('hex');
    } catch (error) {
        console.error("Key generation failed:", error);
        throw new Error('Key generation failed.');
    }
}

function encrypt(text) {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv;
    do {
        iv = crypto.randomBytes(IV_LENGTH);
    } while (lastIV && timingSafeEqual(iv, lastIV)); // Ensure IV is unique

    lastIV = iv; // Store current iv to prevent reuse

    let cipher;

    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    } catch (error) {
        console.error("Cipher creation failed:", error);
        return null;
    }

    let encrypted;

    try {
        encrypted = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);
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

let timingSafeEqual = null;
if (crypto.timingSafeEqual) {
    timingSafeEqual = crypto.timingSafeEqual;
} else {
    timingSafeEqual = (a, b) => {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result === 0;
    };
}

function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    try {
        const aBuf = Buffer.from(a, 'utf8');
        const bBuf = Buffer.from(b, 'utf8');

        return timingSafeEqual(aBuf, bBuf);
    } catch (error) {
        console.error("Safe compare failed:", error);
        return false;
    }
}

function generateSalt(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Consider using a more robust method for key storage and management.
// For example, consider using a hardware security module (HSM) or a key
// management system (KMS) for production environments.

// Added key rotation function.
function rotateKey() {
    if (keyGenerated) {
      console.warn("Rotating encryption key. This will invalidate old data.");
    }
    keyGenerated = false;
    keyDerivationUsed = false; // Reset key derivation flag on rotation
    lastIV = null; // Reset last IV on key rotation
    cachedCipher = null;
    cachedDecipher = null;
    return generateEncryptionKey();
}

// Added function to check if key is set.
function isKeySet() {
    return keyGenerated;
}

// Function to check if key derivation was used.
function isKeyDerived() {
    return keyDerivationUsed;
}

module.exports = {
    encrypt,
    decrypt,
    setEncryptionKey,
    generateEncryptionKey,
    safeCompare,
    deriveEncryptionKey,
    setDeriveKeySalt,
    generateSalt,
    rotateKey, // Export the rotateKey function
    isKeySet,  // Export the isKeySet function
    isKeyDerived //Export the isKeyDerived function
};