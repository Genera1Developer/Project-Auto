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

// Use a WeakMap to prevent IV reuse with specific keys
const ivMap = new WeakMap();

// Cache the cipher for potential performance improvement.  Consider removing for higher security if needed
//let cachedCipher = null;
//let cachedDecipher = null;

// Function to clear sensitive data from memory
function zeroBuffer(buf) {
    if (buf && typeof buf.fill === 'function') {
        buf.fill(0);
    }
}

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
        const derivedKey = crypto.pbkdf2Sync(password, deriveKeySalt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
        if(key){
            zeroBuffer(key);
        }
        key = derivedKey;
        keyGenerated = true;
        keyDerivationUsed = true; //Mark that key derivation was used
        //cachedCipher = null; // Invalidate cached cipher on key change
        //cachedDecipher = null; // Invalidate cached decipher on key change
        ivMap.delete(key); // Clear IV map on key change
    } catch (error) {
        console.error("Key derivation failed:", error);
        throw new Error('Key derivation failed. Check password and salt.');
    } finally {
        // Zero out password after usage to prevent it lingering in memory.
        if (password) {
            zeroBuffer(Buffer.from(password, 'utf8')); // Assuming password is a string
        }
    }
}

function setEncryptionKey(newKey) {
    if (keyGenerated) {
        return; // Key already generated.
    }
    if (!Buffer.isBuffer(newKey) || newKey.length !== KEY_LENGTH) {
        throw new Error(`Invalid key. Key must be a ${KEY_LENGTH}-byte Buffer.`);
    }
    if(key){
        zeroBuffer(key);
    }
    key = Buffer.from(newKey);
    keyGenerated = true;
    keyDerivationUsed = false; //Explicitly set to false when directly setting the key
    //cachedCipher = null; // Invalidate cached cipher on key change
    //cachedDecipher = null; // Invalidate cached decipher on key change
    ivMap.delete(key); // Clear IV map on key change
}

function generateEncryptionKey() {
    if (keyGenerated) {
        return key.toString('hex'); // Key already generated, return existing.
    }
    try {
        const newKey = crypto.generateKeySync('aes', { length: 256 });
        if(key){
            zeroBuffer(key);
        }
        key = newKey;
        keyGenerated = true;
        keyDerivationUsed = false; //Explicitly set to false when generating key
        //cachedCipher = null; // Invalidate cached cipher on key change
        //cachedDecipher = null; // Invalidate cached decipher on key change
        ivMap.delete(key); // Clear IV map on key change
        return newKey.toString('hex');
    } catch (error) {
        console.error("Key generation failed:", error);
        throw new Error('Key generation failed.');
    }
}

const encrypt = (text) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv;
    if (!ivMap.has(key)) {
        ivMap.set(key, null);
    }
    let lastIVForKey = ivMap.get(key);

    do {
        iv = crypto.randomBytes(IV_LENGTH);
    } while (lastIVForKey && timingSafeEqual(iv, lastIVForKey)); // Ensure IV is unique

    ivMap.set(key, iv); // Store current iv to prevent reuse

    let cipher = null;
    let encrypted = null; // Declare encrypted outside the try block
    let authTag = null;     // Declare authTag outside the try block
    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        encrypted = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);
        authTag = cipher.getAuthTag();

        const ciphertext = Buffer.concat([iv, authTag, encrypted]);
        return ciphertext.toString('base64');

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    } finally {
        if (cipher) {
            cipher.destroy();
            zeroBuffer(cipher); //Zero out cipher for added security
        }
        zeroBuffer(iv);
        zeroBuffer(encrypted);
        zeroBuffer(authTag);
    }
};

const decrypt = (text) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let decipher = null;
    let decrypted = null;
    try {
        const ciphertext = Buffer.from(text, 'base64');
        const iv = ciphertext.slice(0, IV_LENGTH);
        const authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
        if (decipher) {
            decipher.destroy();
            zeroBuffer(decipher);
        }
        zeroBuffer(decrypted);
    }
};

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

    let aBuf = null;
    let bBuf = null;
    try {
        aBuf = Buffer.from(a, 'utf8');
        bBuf = Buffer.from(b, 'utf8');

        return timingSafeEqual(aBuf, bBuf);
    } catch (error) {
        console.error("Safe compare failed:", error);
        return false;
    } finally {
        zeroBuffer(aBuf);
        zeroBuffer(bBuf);
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
    //lastIV = null; // Reset last IV on key rotation - Not needed since IV map exists
    //cachedCipher = null;
    //cachedDecipher = null;
    if(key){
        zeroBuffer(key);
    }
    ivMap.delete(key); // Clear IV map on key rotation
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

// Function to get the current algorithm being used.
function getAlgorithm() {
    return algorithm;
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
    isKeyDerived, //Export the isKeyDerived function
    zeroBuffer,
    getAlgorithm // Export the getAlgorithm function
};