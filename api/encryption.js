const crypto = require('crypto');
const stream = require('stream');
const zlib = require('zlib');
const { promisify } = require('util');

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

// Use WeakMaps to store cipher/decipher instances instead
const cipherMap = new WeakMap();
const decipherMap = new WeakMap();

// Promisify zlib functions
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);

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
        cipherMap.clear(); // Clear cipher map on key change - use clear() instead of delete()
        decipherMap.clear(); // Clear decipher map on key change - use clear() instead of delete()
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
    cipherMap.clear(); // Clear cipher map on key change - use clear() instead of delete()
    decipherMap.clear(); // Clear decipher map on key change - use clear() instead of delete()
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
        cipherMap.clear(); // Clear cipher map on key change - use clear() instead of delete()
        decipherMap.clear(); // Clear decipher map on key change - use clear() instead of delete()
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
    try {
        iv = generateSecureIV();
    } catch (error) {
        console.error("IV generation failed:", error);
        return null;
    }

    let cipher = null;
    let encrypted = null;
    let authTag = null;
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
        if (cipher && cipher.destroy) {
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
    let ciphertext = null;
    let iv = null;
    let authTag = null;
    let encryptedData = null;
    try {
        ciphertext = Buffer.from(text, 'base64');
        iv = ciphertext.slice(0, IV_LENGTH);
        authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
         if (decipher && decipher.destroy) {
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
    cipherMap.clear();
    decipherMap.clear();
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
        console.warn("Using less secure Math.random as fallback for randomBytes!");
        return crypto.randomBytes(length); // Retry get random bytes. Will fail on same error.
    }
}

//Function to generate a more secure IV
function generateSecureIV() {
    return generateSecureRandomBytes(IV_LENGTH);
}

const encryptSecure = async (text, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv;
    try {
        iv = generateSecureIV();
    } catch (error) {
        console.error("IV generation failed:", error);
        return null;
    }

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
        compressedData = await deflateAsync(Buffer.from(text, 'utf8'), { level: zlib.constants.Z_BEST_COMPRESSION });
        encrypted = Buffer.concat([cipher.update(compressedData), cipher.final()]);
        authTag = cipher.getAuthTag();

        const ciphertext = Buffer.concat([iv, authTag, encrypted]);
        ciphertextBase64 = ciphertext.toString('base64');
        return ciphertextBase64;

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    } finally {
        if (cipher && cipher.destroy) {
            cipher.destroy();
        }
    }
};

const decryptSecure = async (text, aad = null) => {
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

        decipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
         if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        // Decompress the data after decryption
        decompressedData = await inflateAsync(decrypted);
        resultString = decompressedData.toString('utf8');
        return resultString;

    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
        if (decipher && decipher.destroy) {
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
    cipherMap.clear();
    decipherMap.clear();
}

// Function to encrypt a buffer directly.
const encryptBuffer = async (buffer, aad = null) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    let iv;
    try {
        iv = generateSecureIV();
    } catch (error) {
        console.error("IV generation failed:", error);
        return null;
    }

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
        compressedData = await deflateAsync(buffer, { level: zlib.constants.Z_BEST_COMPRESSION });
        encrypted = Buffer.concat([cipher.update(compressedData), cipher.final()]);
        authTag = cipher.getAuthTag();

        ciphertext = Buffer.concat([iv, authTag, encrypted]);
         return ciphertext;

    } catch (error) {
        console.error("Buffer encryption failed:", error);
        return null;
    } finally {
        if (cipher && cipher.destroy) {
            cipher.destroy();
        }
    }
};

// Function to decrypt a buffer directly.
const decryptBuffer = async (ciphertext, aad = null) => {
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

        decipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH });
        if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        // Decompress the data after decryption
        decompressedData = await inflateAsync(decrypted);
        return decompressedData;
    } catch (error) {
        console.error("Buffer decryption failed:", error);
        return null;
    } finally {
        if (decipher && decipher.destroy) {
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
        try {
            decrypt(text);
            return true;
        } catch (e) {
            return false;
        }
    } catch (error) {
        return false;
    }
}

// Function to encrypt JSON object
const encryptJSON = async (obj, aad = null) => {
    try {
        const text = JSON.stringify(obj);
        return await encryptSecure(text, aad);
    } catch (error) {
        console.error("JSON Encryption failed:", error);
        return null;
    }
};

// Function to decrypt JSON object
const decryptJSON = async (text, aad = null) => {
    try {
        const decryptedText = await decryptSecure(text, aad);
        if (!decryptedText) return null;
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("JSON Decryption failed:", error);
        return null;
    }
};

// Function to encrypt an object with custom serialization
const encryptObject = async (obj, serialize, aad = null) => {
    try {
        const text = serialize(obj);
        return await encryptSecure(text, aad);
    } catch (error) {
        console.error("Object Encryption failed:", error);
        return null;
    }
};

// Function to decrypt an object with custom deserialization
const decryptObject = async (text, deserialize, aad = null) => {
    try {
        const decryptedText = await decryptSecure(text, aad);
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

    let iv;
    try {
        iv = generateSecureIV();
    } catch (error) {
        console.error("IV generation failed:", error);
        throw error;  //Re-throwing here is important
    }

    const cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH, }); // Use autoPadding: true

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
            } finally {
                 if (cipher && cipher.destroy) {
                    cipher.destroy();
                 }
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

                        decipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH, }); // Use autoPadding: true
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
            } finally {
                 if (decipher && decipher.destroy) {
                    decipher.destroy();
                 }
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
let keytarAvailable = false;
try {
    keytar = require('keytar');
    keytarAvailable = true;
} catch (error) {
    console.warn("Keytar not available, using in-memory storage.");
    keytarAvailable = false;
}

const KEYTAR_SERVICE_NAME = "web-proxy-encryption-key";
const KEYTAR_ACCOUNT_NAME = "default";

async function storeKeySecurely(keyToStore) {
    if (keytarAvailable) {
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
    if (keytarAvailable) {
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
    if (keytarAvailable) {
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
     if (!crypto.getCiphers().includes(newAlgorithm)) {
        throw new Error(`Algorithm "${newAlgorithm}" is not supported.`);
    }
    try {
        //Test the cipher before switching. This is important.  Using tryCipher constant to scope the new IV to within this try block.
        const tryIV = generateSecureIV();
        crypto.createCipheriv(newAlgorithm, key, tryIV, { authTagLength: AUTH_TAG_LENGTH });
        algorithm = newAlgorithm;
        console.log(`Algorithm switched to ${newAlgorithm}`);
        cipherMap.clear();
        decipherMap.clear();
    } catch (error) {
        console.error(`Algorithm switch failed: ${error}`);
        throw new Error(`Algorithm switch failed: ${error}`);
    }
}

// Function to encrypt and sign data
const encryptAndSign = async (data, signingKey) => {
    if (!signingKey) {
        throw new Error('Signing key not set.');
    }

    try {
        const encryptedData = await encryptSecure(data);
        if (!encryptedData) {
            throw new Error('Encryption failed.');
        }
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
const verifyAndDecrypt = async (ciphertext, signature, signingKey) => {
    if (!signingKey) {
        throw new Error('Signing key not set.');
    }
    try {
        const hmac = crypto.createHmac('sha256', signingKey);
        hmac.update(ciphertext);
        const expectedSignature = hmac.digest('hex');

        if (!safeCompare(signature, expectedSignature)) {
            console.error("Signature verification failed.");
            return null;
        }

        return await decryptSecure(ciphertext);
    } catch (error) {
        console.error("Verification and decryption failed:", error);
        return null;
    }
};

// Function to derive a signing key from a password
function deriveSigningKey(password, salt) {
    const SIGNING_KEY_LENGTH = 32; // 256 bits
    const SIGNING_PBKDF2_ITERATIONS = 100000;
    const SIGNING_PBKDF2_DIGEST = 'sha512';

    try {
        const derivedKey = crypto.pbkdf2Sync(password, salt, SIGNING_PBKDF2_ITERATIONS, SIGNING_KEY_LENGTH, SIGNING_PBKDF2_DIGEST);
        return derivedKey.toString('hex');
    } catch (error) {
        console.error("Signing key derivation failed:", error);
        throw new Error('Signing key derivation failed. Check password and salt.');
    } finally {
        zeroBuffer(Buffer.from(password, 'utf8'));
    }
}

// Function to generate a secure nonce
function generateNonce(length = 24) {
    return crypto.randomBytes(length).toString('base64');
}

// Function to encrypt with associated data using a nonce
const encryptWithNonce = async (text, aad, nonce) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    if (!nonce) {
        throw new Error('Nonce is required for encryption with nonce.');
    }

    if (nonce.length < 16) {
        throw new Error('Nonce must be at least 16 bytes long.');
    }

    const iv = Buffer.from(nonce, 'base64').slice(0, IV_LENGTH); // Use nonce as IV

    let cipher = null;
    let encrypted = null;
    let authTag = null;
    let compressedData = null;
    let ciphertextBase64 = null;

    try {
        cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH, }); // Use autoPadding: true
        if (aad) {
            cipher.setAAD(Buffer.from(aad, 'utf8'));
        }

        // Compress the data before encryption
        compressedData = await deflateAsync(Buffer.from(text, 'utf8'), { level: zlib.constants.Z_BEST_COMPRESSION });
        encrypted = Buffer.concat([cipher.update(compressedData), cipher.final()]);
        authTag = cipher.getAuthTag();

        const ciphertext = Buffer.concat([iv, authTag, encrypted]);
        ciphertextBase64 = ciphertext.toString('base64');
        return ciphertextBase64;

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    } finally {
        if (cipher && cipher.destroy) {
            cipher.destroy();
        }
    }
};

// Function to decrypt with associated data using a nonce
const decryptWithNonce = async (text, aad, nonce) => {
    if (!key) {
        throw new Error('Encryption key not set. Call setEncryptionKey() first.');
    }

    if (!nonce) {
        throw new Error('Nonce is required for decryption with nonce.');
    }

    if (nonce.length < 16) {
        throw new Error('Nonce must be at least 16 bytes long.');
    }


   const iv = Buffer.from(nonce, 'base64').slice(0, IV_LENGTH); // Use nonce as IV

    let decipher = null;
    let decrypted = null;
    let decompressedData = null;
    let ciphertext = null;
    let authTag = null;
    let encryptedData = null;
    let resultString = null;

    try {
        ciphertext = Buffer.from(text, 'base64');
        authTag = ciphertext.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        encryptedData = ciphertext.slice(IV_LENGTH + AUTH_TAG_LENGTH);

        decipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: AUTH_TAG_LENGTH, }); // Use autoPadding: true
        if (aad) {
            decipher.setAAD(Buffer.from(aad, 'utf8'));
        }
        decipher.setAuthTag(authTag);
        decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        // Decompress the data after decryption
        decompressedData = await inflateAsync(decrypted);
        resultString = decompressedData.toString('utf8');
        return resultString;

    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    } finally {
        if (decipher && decipher.destroy) {
            decipher.destroy();
        }
    }
};

// Function to check for hardware acceleration
function isHardwareAccelerationEnabled() {
    const OPENSSL_VERSION = crypto.OPENSSL_VERSION || '';
    return OPENSSL_VERSION.includes('QUIC');
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
    verifyAndDecrypt,
    deriveSigningKey,
    generateNonce,
    encryptWithNonce,
    decryptWithNonce,
    isHardwareAccelerationEnabled
};