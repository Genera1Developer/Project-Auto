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

// Consider using a more robust method for key storage and management.
// For example, consider using a hardware security module (HSM) or a key
// management system (KMS) for production environments.

// Use a WeakMap to store cipher instances to prevent options pollution
const cipherMap = new WeakMap();
const decipherMap = new WeakMap();

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
        ivMap.delete(key); // Clear IV map on key change
        cipherMap.delete(key); // Clear cipher map on key change
        decipherMap.delete(key); // Clear decipher map on key change
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
    ivMap.delete(key); // Clear IV map on key change
    cipherMap.delete(key); // Clear cipher map on key change
    decipherMap.delete(key); // Clear decipher map on key change
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
        ivMap.delete(key); // Clear IV map on key change
        cipherMap.delete(key); // Clear cipher map on key change
        decipherMap.delete(key); // Clear decipher map on key change
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
    iv = generateSecureIV();

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
        }
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
        }
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
        if(aBuf) zeroBuffer(aBuf);
        if(bBuf) zeroBuffer(bBuf);
    }
}

function generateSalt(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Added key rotation function.
function rotateKey() {
    if (keyGenerated) {
      console.warn("Rotating encryption key. This will invalidate old data.");
    }
    keyGenerated = false;
    keyDerivationUsed = false; // Reset key derivation flag on rotation
    if(key){
        zeroBuffer(key);
    }
    ivMap.delete(key); // Clear IV map on key rotation
    cipherMap.delete(key); // Clear cipher map on key rotation
    decipherMap.delete(key); // Clear decipher map on key rotation
    return generateEncryptionKey();
}

// Added function to check if key is set.
function isKeySet() {
    return keyGenerated;
}

// Added function to check if key derivation was used.
function isKeyDerived() {
    return keyDerivationUsed;
}

// Function to get the current algorithm being used.
function getAlgorithm() {
    return algorithm;
}

//Function to check for strong randomness source availability
function hasStrongRandomnessSource() {
    try {
        crypto.randomBytes(1);
        return true;
    } catch (err) {
        return false;
    }
}

function getKeyDetails() {
    if (!key) {
        return { keySet: false, keyDerived: false, algorithm: algorithm };
    }

    return {
        keySet: keyGenerated,
        keyDerived: keyDerivationUsed,
        algorithm: algorithm,
    };
}

function generateSecureRandomBytes(length) {
    try {
        return crypto.randomBytes(length);
    } catch (error) {
        console.error("Failed to generate cryptographically secure random bytes:", error);
        // Fallback to less secure method (e.g., Math.random) - NOT RECOMMENDED for sensitive data.
        // In production, consider throwing an error or using a seeded PRNG if truly necessary.
        console.warn("Using less secure Math.random as fallback for randomBytes!");
        const buffer = Buffer.alloc(length);
        for (let i = 0; i < length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    }
}

//Function to generate a more secure IV
function generateSecureIV() {
    return generateSecureRandomBytes(IV_LENGTH);
}

const encryptSecure = (text, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv = generateSecureIV();

    let cipher = null;
    let encrypted = null;
    let authTag = null;
    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            cipher.setAAD(Buffer.from(aad, 'utf8'));
        }
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
        }
    }
};

const decryptSecure = (text, aad = null) => {
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
         if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
        if (decipher) {
            decipher.destroy();
        }
    }
};

// Function to securely compare two buffers
function safeBufferCompare(a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    return timingSafeEqual(a, b);
}

// Function to reset the key generation flag, for testing purposes
function resetKeyGeneration() {
    keyGenerated = false;
    keyDerivationUsed = false;
    if (key) {
        zeroBuffer(key);
        key = null;
    }
    ivMap.clear();
    cipherMap.clear();
    decipherMap.clear();
}

// Function to encrypt a buffer directly.
const encryptBuffer = (buffer, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv = generateSecureIV();
    let cipher = null;
    let encrypted = null;
    let authTag = null;

    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            cipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
        authTag = cipher.getAuthTag();

        const ciphertext = Buffer.concat([iv, authTag, encrypted]);
        return ciphertext;

    } catch (error) {
        console.error("Buffer encryption failed:", error);
        return null;
    } finally {
        if (cipher) {
            cipher.destroy();
        }
    }
};

// Function to decrypt a buffer directly.
const decryptBuffer = (ciphertext, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let decipher = null;
    let decrypted = null;

    try {
        const iv = ciphertext.slice(0, IV_LENGTH);
        const authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted;
    } catch (error) {
        console.error("Buffer decryption failed:", error);
        return null;
    } finally {
        if (decipher) {
            decipher.destroy();
        }
    }
};

// Function to check if an object is encrypted
function isEncrypted(text) {
    if (typeof text !== 'string') {
        return false;
    }
    try {
        const ciphertext = Buffer.from(text, 'base64');
        if (ciphertext.length <= IV_LENGTH + AUTH_TAG_LENGTH) {
            return false;
        }
        // Attempt to decrypt, if it fails, it's likely not encrypted
        decrypt(text);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to encrypt JSON object
const encryptJSON = (obj, aad = null) => {
    try {
        const text = JSON.stringify(obj);
        return encryptSecure(text, aad);
    } catch (error) {
        console.error("JSON Encryption failed:", error);
        return null;
    }
};

// Function to decrypt JSON object
const decryptJSON = (text, aad = null) => {
    try {
        const decryptedText = decryptSecure(text, aad);
        if (!decryptedText) return null;
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("JSON Decryption failed:", error);
        return null;
    }
};

// Function to encrypt an object with custom serialization
const encryptObject = (obj, serialize, aad = null) => {
    try {
        const text = serialize(obj);
        return encryptSecure(text, aad);
    } catch (error) {
        console.error("Object Encryption failed:", error);
        return null;
    }
};

// Function to decrypt an object with custom deserialization
const decryptObject = (text, deserialize, aad = null) => {
    try {
        const decryptedText = decryptSecure(text, aad);
         if (!decryptedText) return null;
        return deserialize(decryptedText);
    } catch (error) {
        console.error("Object Decryption failed:", error);
        return null;
    }
};

// Function to directly encrypt a stream
const encryptStream = (inputStream, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    const iv = generateSecureIV();
    const cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });

    if (aad) {
        cipher.setAAD(Buffer.from(aad, 'utf8'));
    }

    const authTag = cipher.getAuthTag();
    const transformStream = new require('stream').Transform({
        transform(chunk, encoding, callback) {
            try{
                const encryptedChunk = cipher.update(chunk);
                callback(null, encryptedChunk);
            } catch (error) {
                callback(error);
            }
        },
        flush(callback) {
            try {
                const finalChunk = cipher.final();
                callback(null, finalChunk);
            } catch (error){
                callback(error);
            }
        }
    });
    inputStream.pipe(transformStream);

    const combinedStream = new require('stream').PassThrough();
    combinedStream.write(iv);
    combinedStream.write(authTag);
    transformStream.pipe(combinedStream, { end: false });

    transformStream.on('end', () => {
        combinedStream.end();
    });

    return combinedStream;
};

// Function to directly decrypt a stream
const decryptStream = (inputStream, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv = null;
    let authTag = null;
    let dataStarted = false;

    const transformStream = new require('stream').Transform({
        transform(chunk, encoding, callback) {
            try {
                if (!dataStarted) {
                    if (!iv) {
                        iv = chunk.slice(0, IV_LENGTH);
                        chunk = chunk.slice(IV_LENGTH);
                    }
                    if (iv && !authTag && chunk.length >= AUTH_TAG_LENGTH) {
                        authTag = chunk.slice(0, AUTH_TAG_LENGTH);
                        chunk = chunk.slice(AUTH_TAG_LENGTH);
                        dataStarted = true;

                        const decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
                        if (aad) {
                            decipher.setAAD(Buffer.from(aad, 'utf8'));
                        }
                        decipher.setAuthTag(authTag);

                        const decryptedChunk = decipher.update(chunk);
                        callback(null, decryptedChunk);
                    } else if (iv && !authTag && chunk.length < AUTH_TAG_LENGTH){
                        //Accumulate more data for authTag.
                        return callback(null, null);
                    }
                     else {
                        return callback(new Error("Invalid data format."));
                    }
                } else {
                    const decipher = this.decipher || crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
                    if(aad && !this.aadSet) {
                         decipher.setAAD(Buffer.from(aad, 'utf8'));
                         this.aadSet = true;
                    }

                    this.decipher = decipher;
                    const decryptedChunk = decipher.update(chunk);
                    callback(null, decryptedChunk);
                }
            } catch (error) {
                callback(error);
            }
        },
        flush(callback) {
            try {
                 const decipher = this.decipher;
                if(decipher){
                    const finalChunk = decipher.final();
                     callback(null, finalChunk);
                } else {
                    callback(null, null); //No data received
                }

            } catch (error) {
                callback(error);
            }
        }
    });

    inputStream.pipe(transformStream);
    return transformStream;
};


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
    getAlgorithm, // Export the getAlgorithm function
    hasStrongRandomnessSource, //Export function
    getKeyDetails,
    generateSecureRandomBytes,
    encryptSecure,
    decryptSecure,
    safeBufferCompare,
    resetKeyGeneration,
    encryptBuffer,
    decryptBuffer,
    isEncrypted,
    encryptJSON,
    decryptJSON,
    encryptObject,
    decryptObject,
    encryptStream,
    decryptStream
};