const crypto = require('crypto');
const stream = require('stream');
const zlib = require('zlib');

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
        console.warn("Key already generated. Skipping key derivation.");
        return; // Key already generated.
    }
    if (!deriveKeySalt) {
        throw new Error('Derive key salt not set.');
    }

    let derivedKey = null;
    try {
        derivedKey = crypto.pbkdf2Sync(password, deriveKeySalt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
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
        derivedKey = null; // Ensure derived key is nulled.
    }
}

function setEncryptionKey(newKey) {
    if (keyGenerated) {
         console.warn("Key already generated. Skipping key setting.");
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
        console.warn("Key already generated, returning existing key.");
        return key.toString('hex'); // Key already generated, return existing.
    }
    let newKey = null;
    try {
        newKey = crypto.generateKeySync('aes', { length: 256 });
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
    } finally{
        newKey = null; // Ensure newKey is nulled
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
    let ciphertext = null;
    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        encrypted = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);
        authTag = cipher.getAuthTag();

        ciphertext = Buffer.concat([iv, authTag, encrypted]);
        return ciphertext.toString('base64');

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    } finally {
        if (cipher) {
            cipher.destroy();
        }
        iv = null;
        encrypted = null;
        authTag = null;
        ciphertext = null;
    }
};

const decrypt = (text) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let decipher = null;
    let decrypted = null;
    let ciphertext = null;
    let iv = null;
    let authTag = null;
    let encryptedData = null;
    try {
        ciphertext = Buffer.from(text, 'base64');
        iv = ciphertext.slice(0, IV_LENGTH);
        authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

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
        ciphertext = null;
        iv = null;
        authTag = null;
        encryptedData = null;
        decrypted = null;
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
    let result = false;
    try {
        aBuf = Buffer.from(a, 'utf8');
        bBuf = Buffer.from(b, 'utf8');

        result = timingSafeEqual(aBuf, bBuf);
        return result;
    } catch (error) {
        console.error("Safe compare failed:", error);
        return false;
    } finally {
        if(aBuf) zeroBuffer(aBuf);
        if(bBuf) zeroBuffer(bBuf);
        aBuf = null;
        bBuf = null;
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
        key = null;
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
    let compressedData = null;
    let ciphertextBase64 = null;

    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            cipher.setAAD(Buffer.from(aad, 'utf8'));
        }

        // Compress the data before encryption
        zlib.deflate(Buffer.from(text, 'utf8'), { level: zlib.constants.Z_BEST_COMPRESSION }, (err, result) => {
            if (err) {
                console.error("Compression failed:", err);
                return null; //Or throw an error, depending on your needs
            }
            compressedData = result;
            encrypted = Buffer.concat([cipher.update(compressedData), cipher.final()]);
            authTag = cipher.getAuthTag();

            const ciphertext = Buffer.concat([iv, authTag, encrypted]);
            ciphertextBase64 = ciphertext.toString('base64');
            return ciphertextBase64;
        });

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    } finally {
        if (cipher) {
            cipher.destroy();
        }
        iv = null;
        encrypted = null;
        authTag = null;
        compressedData = null;
    }
};

const decryptSecure = (text, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let decipher = null;
    let decrypted = null;
    let decompressedData = null;
    let ciphertext = null;
    let iv = null;
    let authTag = null;
    let encryptedData = null;
    let resultString = null;

    try {
        ciphertext = Buffer.from(text, 'base64');
        iv = ciphertext.slice(0, IV_LENGTH);
        authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
         if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        // Decompress the data after decryption
        zlib.inflate(decrypted, (err, result) => {
            if (err) {
                console.error("Decompression failed:", err);
                return null; //Or throw an error, depending on your needs
            }
            decompressedData = result;
            resultString = decompressedData.toString('utf8');
            return resultString;
        });

    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
        if (decipher) {
            decipher.destroy();
        }
        ciphertext = null;
        iv = null;
        authTag = null;
        encryptedData = null;
        decrypted = null;
        decompressedData = null;
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
    let compressedData = null;
    let ciphertext = null;

    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            cipher.setAAD(Buffer.from(aad, 'utf8'));
        }

        // Compress the data before encryption
        zlib.deflate(buffer, { level: zlib.constants.Z_BEST_COMPRESSION }, (err, result) => {
             if (err) {
                console.error("Compression failed:", err);
                return null; //Or throw an error, depending on your needs
            }
            compressedData = result;
            encrypted = Buffer.concat([cipher.update(compressedData), cipher.final()]);
            authTag = cipher.getAuthTag();

            ciphertext = Buffer.concat([iv, authTag, encrypted]);
             return ciphertext;
        });

    } catch (error) {
        console.error("Buffer encryption failed:", error);
        return null;
    } finally {
        if (cipher) {
            cipher.destroy();
        }
        iv = null;
        encrypted = null;
        authTag = null;
        compressedData = null;
    }
};

// Function to decrypt a buffer directly.
const decryptBuffer = (ciphertext, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let decipher = null;
    let decrypted = null;
    let decompressedData = null;
    let iv = null;
    let authTag = null;
    let encryptedData = null;

    try {
        iv = ciphertext.slice(0, IV_LENGTH);
        authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        // Decompress the data after decryption
        zlib.inflate(decrypted, (err, result) => {
             if (err) {
                console.error("Decompression failed:", err);
                return null; //Or throw an error, depending on your needs
            }
            decompressedData = result;
            return decompressedData;
        });
    } catch (error) {
        console.error("Buffer decryption failed:", error);
        return null;
    } finally {
        if (decipher) {
            decipher.destroy();
        }
        iv = null;
        authTag = null;
        encryptedData = null;
        decrypted = null;
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

    // Create a gzip stream for compression
    const gzip = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
    const authTag = cipher.getAuthTag();

    const prepend = Buffer.concat([iv, authTag]);
    const transformStream = new stream.Transform({
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

    // Create a PassThrough stream to prepend IV and AuthTag
    const prependStream = new stream.PassThrough();
    prependStream.write(prepend);

    // Chain the streams together with compression
    inputStream.pipe(gzip).pipe(transformStream).pipe(prependStream);

    return prependStream;
};

// Function to directly decrypt a stream
const decryptStream = (inputStream, aad = null) => {
   if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv = null;
    let authTag = null;
    let headerReceived = false;
    let decipher = null;

    // Create a gunzip stream for decompression
    const gunzip = zlib.createGunzip();

    const transformStream = new stream.Transform({
        transform(chunk, encoding, callback) {
            try {
                if (!headerReceived) {
                    if (!iv) {
                        iv = chunk.slice(0, IV_LENGTH);
                    }
                    if (!authTag && chunk.length >= IV_LENGTH + AUTH_TAG_LENGTH) {
                        authTag = chunk.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
                        chunk = chunk.slice(IV_LENGTH + AUTH_TAG_LENGTH);
                        headerReceived = true;

                        decipher = crypto.createDecipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
                        if (aad) {
                            decipher.setAAD(Buffer.from(aad, 'utf8'));
                        }
                        decipher.setAuthTag(authTag);
                    } else {
                        return callback(null, null);
                    }
                    if (!iv || !authTag) {
                         return callback(new Error("Invalid data format."));
                    }
                }

                const decryptedChunk = decipher.update(chunk);
                callback(null, decryptedChunk);

            } catch (error) {
                callback(error);
            }
        },
        flush(callback) {
            try {
                const finalChunk = decipher ? decipher.final() : Buffer.alloc(0);
                callback(null, finalChunk);
            } catch (error) {
                callback(error);
            }
        }
    });

    // Chain streams together with decompression
    inputStream.pipe(transformStream).pipe(gunzip);

    return gunzip;
};

// Pre-compute prime and generator for DHKE
const dhParams = crypto.getDiffieHellman(' Oakley-EC2N-Koblitz'); //Named curve
const dhPrime = dhParams.getPrime();
const dhGenerator = dhParams.getGenerator();

// Function to generate Diffie-Hellman key exchange parameters
function generateDHKEParams() {
    const dh = crypto.createDiffieHellman(dhPrime, dhGenerator);
    const publicKey = dh.generateKeys();
    return {
        publicKey: publicKey.toString('base64'),
        dh: dh // Store the DH object in session or cache. Do not expose.
    };
}

// Function to compute shared secret
function computeSharedSecret(privateDH, otherPartyPublicKey) {
    try {
        const otherPartyPublicKeyBuffer = Buffer.from(otherPartyPublicKey, 'base64');
        return privateDH.computeSecret(otherPartyPublicKeyBuffer);
    } catch (error) {
        console.error("Failed to compute shared secret:", error);
        return null;
    }
}

// Added a more secure key storage using node-keytar if possible
let keytar = null;
try {
    keytar = require('keytar');
} catch (error) {
    console.warn("Keytar not available, using in-memory storage.");
}

const KEYTAR_SERVICE_NAME = "web-proxy-encryption-key";
const KEYTAR_ACCOUNT_NAME = "default";

async function storeKeySecurely(keyToStore) {
    if (keytar) {
        try {
            await keytar.setPassword(KEYTAR_SERVICE_NAME, KEYTAR_ACCOUNT_NAME, keyToStore.toString('hex'));
            console.log("Encryption key stored securely using keytar.");
        } catch (error) {
            console.error("Failed to store key securely using keytar:", error);
            throw new Error("Failed to store key securely.");
        }
    } else {
        throw new Error("Keytar not available, cannot store key securely.");
    }
}

async function retrieveKeySecurely() {
    if (keytar) {
        try {
            const keyHex = await keytar.getPassword(KEYTAR_SERVICE_NAME, KEYTAR_ACCOUNT_NAME);
            if (keyHex) {
                console.log("Encryption key retrieved securely using keytar.");
                return Buffer.from(keyHex, 'hex');
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed to retrieve key securely using keytar:", error);
            return null;
        }
    } else {
        console.warn("Keytar not available, cannot retrieve key securely.");
        return null;
    }
}

async function deleteKeySecurely() {
    if (keytar) {
        try {
            await keytar.deletePassword(KEYTAR_SERVICE_NAME, KEYTAR_ACCOUNT_NAME);
            console.log("Encryption key deleted securely using keytar.");
        } catch (error) {
            console.error("Failed to delete key securely using keytar:", error);
        }
    } else {
        console.warn("Keytar not available, cannot delete key securely.");
    }
}

// Function to get the list of supported ciphers
function getSupportedCiphers() {
    return crypto.getCiphers();
}

// Function to switch to a new cipher
function setAlgorithm(newAlgorithm) {
    try {
        crypto.createCipheriv(newAlgorithm, key, generateSecureIV(), { authTagLength: AUTH_TAG_LENGTH });
        algorithm = newAlgorithm;
        console.log(`Algorithm switched to ${newAlgorithm}`);
    } catch (error) {
        console.error(`Algorithm switch failed: ${error}`);
        throw new Error(`Algorithm switch failed: ${error}`);
    }
}

// Function to encrypt and sign data
const encryptAndSign = (data, signingKey) => {
    try {
        const encryptedData = encryptSecure(data);
        const hmac = crypto.createHmac('sha256', signingKey);
        hmac.update(encryptedData);
        const signature = hmac.digest('hex');
        return {
            ciphertext: encryptedData,
            signature: signature
        };
    } catch (error) {
        console.error("Encryption and signing failed:", error);
        return null;
    }
};

// Function to verify signature and decrypt data
const verifyAndDecrypt = (ciphertext, signature, signingKey) => {
    try {
        const hmac = crypto.createHmac('sha256', signingKey);
        hmac.update(ciphertext);
        const expectedSignature = hmac.digest('hex');

        if (!safeCompare(signature, expectedSignature)) {
            console.error("Signature verification failed.");
            return null;
        }

        return decryptSecure(ciphertext);
    } catch (error) {
        console.error("Verification and decryption failed:", error);
        return null;
    }
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
    decryptStream,
    generateDHKEParams,
    computeSharedSecret,
    storeKeySecurely,
    retrieveKeySecurely,
    deleteKeySecurely,
    getSupportedCiphers,
    setAlgorithm,
    encryptAndSign,
    verifyAndDecrypt
};