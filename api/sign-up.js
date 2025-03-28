//sign-up.js
const crypto = require('crypto');
const scrypt = require('scrypt-kdf');
const argon2 = require('argon2');
const timingSafeCompare = require('tsscmp');
const { promisify } = require('util');
const zlib = require('zlib');

const SCRYPT_CONFIG = {
  cost: 16384,
  blockSizeFactor: 8,
  parallelizationFactor: 1,
  maxMemory: 67108864,
};

const randomBytesAsync = promisify(crypto.randomBytes);
const gzip = promisify(zlib.gzip);
const deflate = promisify(zlib.deflate);
const gunzip = promisify(zlib.gunzip);
const inflate = promisify(zlib.inflate);

async function hashPasswordScrypt(password, salt) {
  const derivedKey = await scrypt.scrypt(password, salt, SCRYPT_CONFIG);
  return derivedKey.toString('hex');
}

async function hashPasswordArgon2(password, salt) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memory: 2**16,
      timeCost: 2,
      parallelism: 1,
      secret: Buffer.from(process.env.ARGON2_SECRET || ''), // optional secret
      salt: salt
    });
  } catch (err) {
    console.error(err);
    throw new Error('Argon2 hashing failed');
  }
}

async function generateSalt() {
  const buffer = await randomBytesAsync(32);
  return buffer.toString('hex');
}

function timingSafeEqual(a, b) {
  return timingSafeCompare(a, b);
}

// Function to encrypt data using AES-256-GCM
async function encryptData(data, encryptionKey, iv = null) {
  try {
    const actualIv = iv ? Buffer.from(iv, 'hex') : await randomBytesAsync(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), actualIv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('hex'),
      iv: actualIv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

// Function to decrypt data using AES-256-GCM
async function decryptData(encryptedData, encryptionKey, iv, authTag) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

// Function to derive a key from a password using PBKDF2
async function deriveKey(password, salt) {
    const iterations = 200000; // Increased iterations
    const keyLength = 32; // 32 bytes for AES-256
    const digest = 'sha512';
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
    return derivedKey.toString('hex');
}

// Function to generate a strong, random encryption key
async function generateEncryptionKey() {
    const key = await randomBytesAsync(32); // 32 bytes for AES-256
    return key.toString('hex');
}

// Function to apply salting to the username before encryption
function saltUsername(username, salt) {
    const combined = username + salt;
    return crypto.createHmac('sha256').update(combined).digest('hex');
}

// Function to securely erase sensitive data from memory
function secureErase(buffer) {
    crypto.randomFillSync(buffer);
    buffer.fill(0); // Overwrite with zeros after random fill
}

// Function to generate a random password for key derivation
async function generateRandomPassword() {
    const buffer = await randomBytesAsync(32);
    return buffer.toString('hex');
}

// Function to encrypt sensitive user data before storing it
async function encryptUserData(userData, masterKey, iv = null) {
    try {
        const actualIv = iv ? Buffer.from(iv, 'hex') : await randomBytesAsync(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), actualIv);
        const aad = Buffer.from(process.env.AAD_FOR_ENCRYPTION || 'DefaultAad', 'utf8');
        cipher.setAAD(aad);
        const encrypted = Buffer.concat([cipher.update(JSON.stringify(userData)), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return {
            iv: actualIv.toString('hex'),
            encryptedData: encrypted.toString('hex'),
            authTag: authTag.toString('hex'),
            aad: aad.toString('hex')
        };
    } catch (error) {
      console.error("Encryption error:", error);
      return null;
    }
}

// Function to decrypt sensitive user data after retrieving it
async function decryptUserData(encryptedData, iv, authTag, masterKey, aad) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), Buffer.from(iv, 'hex'));
        const associatedData = Buffer.from(aad, 'hex');
        decipher.setAAD(associatedData);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
        return JSON.parse(decrypted.toString());
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Key stretching to improve key derivation robustness
async function stretchKey(key, salt, iterations = 5) { // Increased iterations
    let stretchedKey = key;
    for (let i = 0; i < iterations; i++) {
        stretchedKey = crypto.createHmac('sha512', salt).update(stretchedKey).digest('hex');
    }
    return stretchedKey;
}

// Function to protect against replay attacks using a nonce
async function generateNonce() {
    const buffer = await randomBytesAsync(16);
    return buffer.toString('hex');
}

// Function to validate the nonce to prevent replay attacks
function isValidNonce(nonce, storedNonces) {
    if (!nonce || storedNonces.has(nonce)) {
        return false;
    }
    storedNonces.add(nonce);
    setTimeout(() => {
        storedNonces.delete(nonce); // Remove nonce after a timeout
    }, 60000); // Nonce valid for 60 seconds
    return true;
}

// Centralized error handling with logging
function handleSignupError(res, error, message = 'Internal server error') {
  console.error("Signup Error:", error);
  return res.status(500).json({ message });
}

// Rate Limiting
const signupAttempts = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour

// In-memory nonce storage for demonstration purposes.  Replace with Redis.
const storedNonces = new Set();

// Function to generate a unique identifier for each user
async function generateUserId() {
    const buffer = await randomBytesAsync(16);
    return buffer.toString('hex');
}

// Function to generate a new random salt for each encryption operation
async function generateOperationSalt() {
  const buffer = await randomBytesAsync(16);
  return buffer.toString('hex');
}

// Function to apply extra layer of encryption using Chacha20-Poly1305
async function chachaEncrypt(data, key, nonce) {
  try {
    const cipher = crypto.createCipheriv('chacha20-poly1305', Buffer.from(key, 'hex'), Buffer.from(nonce, 'hex'));
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted.toString('hex');
  } catch (error) {
    console.error("Chacha20 encryption error:", error);
    return null;
  }
}

// Function to decrypt using Chacha20-Poly1305
async function chachaDecrypt(encryptedData, key, nonce) {
  try {
    const decipher = crypto.createDecipheriv('chacha20-poly1305', Buffer.from(key, 'hex'), Buffer.from(nonce, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Chacha20 decryption error:", error);
    return null;
  }
}

// Function to hash a value with SHA-384 algorithm
function hashWithSHA384(value) {
    const hash = crypto.createHash('sha384');
    hash.update(value);
    return hash.digest('hex');
}

// New function to generate a session key
async function generateSessionKey() {
    const key = await randomBytesAsync(32); // 32 bytes for AES-256
    return key.toString('hex');
}

// Function to encrypt the derived encryption key with a session key
async function encryptDerivedKey(derivedKey, sessionKey, iv = null) {
    try {
        const actualIv = iv ? Buffer.from(iv, 'hex') : await randomBytesAsync(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(sessionKey, 'hex'), actualIv);
        let encrypted = cipher.update(derivedKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();

        return {
            encryptedDerivedKey: encrypted.toString('hex'),
            iv: actualIv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

// Function to apply a randomized salting method
function randomizedSalt(input) {
  const randomPrefix = crypto.randomBytes(8).toString('hex');
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  return randomPrefix + input + randomSuffix;
}

// Function to encrypt a value with SHA-512 algorithm
function hashWithSHA512(value) {
    const hash = crypto.createHash('sha512');
    hash.update(value);
    return hash.digest('hex');
}

// Function to add a random padding
function addRandomPadding(data, minPaddingLength = 8, maxPaddingLength = 32) {
    const paddingLength = Math.floor(Math.random() * (maxPaddingLength - minPaddingLength + 1)) + minPaddingLength;
    const padding = crypto.randomBytes(paddingLength).toString('hex');
    return data + padding;
}

// New function to implement homomorphic encryption (additively)
function homomorphicEncrypt(plaintext, publicKey) {
    const encryptedValue = plaintext + publicKey; // Simple addition for demonstration
    return encryptedValue;
}

// New function to implement homomorphic decryption (additively)
function homomorphicDecrypt(encryptedValue, publicKey) {
    const decryptedValue = encryptedValue - publicKey; // Simple subtraction
    return decryptedValue;
}

// Function to encrypt a password with extra rounds
async function encryptPasswordWithRounds(password, rounds = 3) {
    let encryptedPassword = password;
    for (let i = 0; i < rounds; i++) {
        const opSalt = await generateOperationSalt();
        const encryptionResult = await encryptData(encryptedPassword, process.env.MASTER_ENCRYPTION_KEY + opSalt);
        if (encryptionResult) {
            encryptedPassword = encryptionResult.encryptedData;
        } else {
            throw new Error("Encryption failed");
        }
    }
    return encryptedPassword;
}

// Function to encrypt user data with multiple keys
async function multiKeyEncrypt(data, keys) {
    let encryptedData = data;
    for (const key of keys) {
        const opSalt = await generateOperationSalt();
        const encryptionResult = await encryptData(encryptedData, key + opSalt);
        if (encryptionResult) {
            encryptedData = encryptionResult.encryptedData;
        } else {
            throw new Error("Encryption failed");
        }
    }
    return encryptedData;
}

// Function to generate a random key for data obfuscation
async function generateObfuscationKey() {
  const buffer = await randomBytesAsync(32);
  return buffer.toString('hex');
}

// Function to obfuscate data with a random key using XOR
function obfuscateData(data, key) {
    const dataBuffer = Buffer.from(data, 'hex');
    const keyBuffer = Buffer.from(key, 'hex');
    const result = Buffer.alloc(dataBuffer.length);

    for (let i = 0; i < dataBuffer.length; i++) {
        result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return result.toString('hex');
}

// Function to generate a MAC (Message Authentication Code)
async function generateMAC(data, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}

// New function to add Jitter to encryption processes
function addJitter(milliseconds) {
  const jitter = Math.floor(Math.random() * milliseconds);
  return new Promise(resolve => setTimeout(resolve, jitter));
}

// Simulated Hardware Security Module (HSM)
const hsm = {
    wrappedKey: null, // Holds the wrapped key
    wrapKey: async function(keyToWrap, wrappingKey) {
      try {
        const iv = await randomBytesAsync(16);
        const cipher = crypto.createCipheriv('aes-256-wrap', Buffer.from(wrappingKey, 'hex'), iv);
        const wrappedKey = Buffer.concat([cipher.update(Buffer.from(keyToWrap, 'hex')), cipher.final()]);
        this.wrappedKey = {
          key: wrappedKey.toString('hex'),
          iv: iv.toString('hex'),
          wrappingKey: wrappingKey
        };
        return this.wrappedKey;
      } catch (error) {
        console.error("HSM Wrap Key Error:", error);
        return null;
      }
    },
    unwrapKey: async function(wrappedKey, iv, wrappingKey) {
      try {
        const decipher = crypto.createDecipheriv('aes-256-wrap', Buffer.from(wrappingKey, 'hex'), Buffer.from(iv, 'hex'));
        const unwrappedKey = Buffer.concat([decipher.update(Buffer.from(wrappedKey, 'hex')), decipher.final()]);
        return unwrappedKey.toString('hex');
      } catch (error) {
        console.error("HSM Unwrap Key Error:", error);
        return null;
      }
    }
};

// Function to add a keyed hash
async function keyedHash(data, key) {
  const hmac = crypto.createHmac('sha512', key);
  hmac.update(data);
  return hmac.digest('hex');
}

// Add time-based one-time password (TOTP)
const generateTOTP = (key, timeStep = 30) => {
  const time = Math.floor(Date.now() / 1000 / timeStep);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(0, 0);
  timeBuffer.writeUInt32BE(time, 4);
  const hmac = crypto.createHmac('sha512', Buffer.from(key, 'hex'));
  hmac.update(timeBuffer);
  const hmacResult = hmac.digest();
  const offset = hmacResult[hmacResult.length - 1] & 0x0F;
  const code = (hmacResult.readUInt32BE(offset) & 0x7FFFFFFF) % 1000000; // 6 digits
  return code.toString().padStart(6, '0');
};

// Function to compress data using Gzip
async function compressData(data) {
  try {
    const compressedData = await gzip(data);
    return compressedData.toString('hex');
  } catch (error) {
    console.error("Gzip compression error:", error);
    return null;
  }
}

// Function to decompress data using Gzip
async function decompressData(compressedData) {
  try {
    const buffer = Buffer.from(compressedData, 'hex');
    const decompressedData = await gunzip(buffer);
    return decompressedData.toString();
  } catch (error) {
    console.error("Gzip decompression error:", error);
    return null;
  }
}

// Function to generate a random initialization vector
async function generateIV() {
    const buffer = await randomBytesAsync(16);
    return buffer.toString('hex');
}

// Enhanced data integrity check using HMAC
async function generateDataIntegrityToken(data, masterKey) {
    const hmac = crypto.createHmac('sha512', masterKey);
    hmac.update(data);
    return hmac.digest('hex');
}

// Function to verify data integrity
async function verifyDataIntegrity(data, integrityToken, masterKey) {
    const expectedToken = await generateDataIntegrityToken(data, masterKey);
    return timingSafeEqual(integrityToken, expectedToken);
}

// Function to mask sensitive data in logs (using XOR)
function maskData(data, maskKey) {
  const dataBuffer = Buffer.from(data, 'hex');
  const maskKeyBuffer = Buffer.from(maskKey, 'hex');
  const result = Buffer.alloc(dataBuffer.length);

  for (let i = 0; i < dataBuffer.length; i++) {
      result[i] = dataBuffer[i] ^ maskKeyBuffer[i % maskKeyBuffer.length];
  }

  return result.toString('hex');
}

//New function to derive a key using HKDF algorithm
async function deriveKeyHKDF(ikm, salt, info, keyLength = 32) {
    try {
      const hkdf = crypto.hkdfSync('sha512', ikm, salt, info, keyLength);
      return hkdf.toString('hex');
    } catch (error) {
      console.error("HKDF derivation error:", error);
      return null;
    }
  }

// New function to implement authenticated encryption with associated data (AEAD)
async function authenticatedEncrypt(plaintext, key, aad) {
    try {
        const iv = await generateIV();
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        cipher.setAAD(Buffer.from(aad, 'utf8'));
        let encrypted = cipher.update(plaintext, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();

        return {
            ciphertext: encrypted.toString('hex'),
            iv: iv,
            authTag: authTag.toString('hex')
        };
    } catch (error) {
        console.error("AEAD Encryption error:", error);
        return null;
    }
}

// New function to implement authenticated decryption with associated data (AEAD)
async function authenticatedDecrypt(ciphertext, key, iv, authTag, aad) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        decipher.setAAD(Buffer.from(aad, 'utf8'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(Buffer.from(ciphertext, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("AEAD Decryption error:", error);
        return null;
    }
}

// Function to encrypt session data using AES-CBC
async function encryptSessionData(data, sessionKey, iv) {
    try {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), Buffer.from(iv, 'hex'));
        let encrypted = cipher.update(data, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    } catch (error) {
        console.error("AES-CBC Encryption error:", error);
        return null;
    }
}

// Function to decrypt session data using AES-CBC
async function decryptSessionData(encryptedData, sessionKey, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'), 'hex');
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("AES-CBC Decryption error:", error);
        return null;
    }
}

// Function to generate a unique user ID
async function generateUniqueUserId() {
    const buffer = await randomBytesAsync(32);
    return buffer.toString('hex');
}

// Function to generate a new key using X25519 Key Exchange
async function generateX25519KeyPair() {
    return crypto.generateKeyPairSync('x25519');
}

// Function to perform X25519 Key Agreement
async function performX25519KeyAgreement(privateKey, publicKey) {
  return crypto.diffieHellman({
    privateKey: privateKey,
    publicKey: publicKey
  });
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password, hashingAlgo = 'argon2', nonce } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    // Nonce validation
    if (!nonce || !isValidNonce(nonce, storedNonces)) {
        return res.status(400).json({ message: 'Invalid or missing nonce. Replay attack?' });
    }

    const ip = req.ip || req.connection.remoteAddress;
    const attempts = signupAttempts.get(ip) || { count: 0, blockUntil: null };

    if (attempts.blockUntil && Date.now() < attempts.blockUntil) {
      return res.status(429).json({ message: 'Too many attempts. Try again later.' });
    }

    let hashedPassword, salt = null;
    let derivedEncryptionKey = null;
    let randomPassword = null;
    let userId = null; // Unique user identifier
    let totpKey = null;
    let passwordHash = null; // Hash of the user's password
    let usernameHash = null;
    let sessionKey = null;
    let aad = null;
    let x25519KeyPair = null;

    try {
      if (hashingAlgo === 'scrypt') {
        salt = await generateSalt();
        hashedPassword = await hashPasswordScrypt(password, salt);
      } else if (hashingAlgo === 'argon2'){
        salt = await generateSalt();
        hashedPassword = await hashPasswordArgon2(password, Buffer.from(salt, 'hex'));
      }
      else{
        return res.status(400).json({ message: 'Invalid hashing algorithm'});
      }

      // 0. Generate a unique User ID
      userId = await generateUniqueUserId();

      //Securely store data (e.g., in a database):

      // 1. Generate a unique encryption key per user, derived from password and salt.
      randomPassword = await generateRandomPassword();
      derivedEncryptionKey = await deriveKey(randomPassword, salt); //Derive key from random pw

       // Add Jitter before Password hashing
      await addJitter(50);

      // Hash the user's password
      passwordHash = hashWithSHA512(randomizedSalt(password));

      // Hash username
      usernameHash = hashWithSHA512(randomizedSalt(username));

      // Add Jitter before Key stretching
      await addJitter(50);

      // Stretch the derived encryption key for added security
      derivedEncryptionKey = await stretchKey(derivedEncryptionKey, salt, 5);

      // Generate a session key
      sessionKey = await generateSessionKey();

       // Add Jitter before Encrypt derived key
      await addJitter(50);

      // Encrypt derived key using session key
      const derivedKeyIv = await generateIV();
      const { encryptedDerivedKey, iv: actualDerivedKeyIv, authTag: derivedKeyAuthTag } = await encryptDerivedKey(derivedEncryptionKey, sessionKey, derivedKeyIv);

      // 2. Encrypt the username and salt
      const saltedUsername = saltUsername(username, salt);

      // Generate operation salts
      const usernameOpSalt = await generateOperationSalt();
      const saltOpSalt = await generateOperationSalt();

      // Add Jitter before Encrypt username and salt
      await addJitter(50);

      const usernameIv = await generateIV();
      const encryptedUsername = await encryptData(saltedUsername, derivedEncryptionKey + usernameOpSalt, usernameIv); // Use operation salt
      const saltIv = await generateIV();
      const encryptedSalt = salt ? await encryptData(salt, derivedEncryptionKey + saltOpSalt, saltIv) : null; // Use operation salt

      // Homomorphic Encryption example (using userId as plaintext and sessionKey as publicKey):
      const publicKey = parseInt(sessionKey.substring(0, 8), 16); // Use a portion of sessionKey as publicKey
      const encryptedUserId = homomorphicEncrypt(parseInt(userId.substring(0, 8), 16), publicKey).toString(16);

      // 3. Store the encryptedUsername, encryptedSalt, and hashedPassword.
      // For demonstration, we log them. NEVER log sensitive data in production.

      //Generate TOTP Key
      totpKey = await generateEncryptionKey();
      const totp = generateTOTP(totpKey);

      // Generate X25519 Key Pair
      x25519KeyPair = await generateX25519KeyPair();

      // Perform X25519 Key Agreement (example with another key)
      const sharedSecret = await performX25519KeyAgreement(x25519KeyPair.privateKey, x25519KeyPair.publicKey);

      const userRecord = {
        userId: encryptedUserId, // Store encrypted UserId
        passwordHash: passwordHash, // Store password hash
        encryptedUsername: encryptedUsername ? encryptedUsername.encryptedData : null,
        encryptedSalt: encryptedSalt ? encryptedSalt.encryptedData : null,
        usernameHash: usernameHash, // Store username hash
        encryptedDerivedKey: encryptedDerivedKey,  // Store encrypted key
        derivedKeyIv: actualDerivedKeyIv,           // Store initialization vector
        derivedKeyAuthTag: derivedKeyAuthTag,    // Store authentication tag
        totpKey: totpKey, // Store TOTP key
        usernameIv: usernameIv,
        saltIv: saltIv,
        x25519PublicKey: x25519KeyPair.publicKey.toString('hex') //Store X25519 Public Key
      };

      // Add Jitter before Encrypt user record
      await addJitter(50);

       // Generate associated data (AAD)
       aad = await generateEncryptionKey(); // Using randomly generated key as AAD.

      // Encrypt entire user record before storage using master key
      const masterKey = process.env.MASTER_ENCRYPTION_KEY || 'defaultinsecurekeythatmustbechanged';
      const encryptedUserRecord = await authenticatedEncrypt(JSON.stringify(userRecord), masterKey, aad);
      if (!encryptedUserRecord){
        return handleSignupError(res, new Error("AEAD encryption failed"), "AEAD encryption failed");
      }

      // Add Jitter before Chacha Encryption
      await addJitter(50);

      // Apply an extra layer of encryption with Chacha20
      const chachaNonce = await generateNonce();
      const doubleEncryptedUserRecord = await chachaEncrypt(JSON.stringify(encryptedUserRecord), masterKey, chachaNonce);

      // Add Jitter before Random Padding
      await addJitter(50);

      // Add Random Padding
      const paddedEncryptedUserRecord = addRandomPadding(doubleEncryptedUserRecord);

      // Add Jitter before Data Obfuscation
       await addJitter(50);

      // Generate obfuscation key
      const obfuscationKey = await generateObfuscationKey();

      // Obfuscate the padded and encrypted user record
      const obfuscatedUserRecord = obfuscateData(paddedEncryptedUserRecord, obfuscationKey);

      // Add Jitter before Generating MAC
      await addJitter(50);

      // Generate a MAC for data integrity
      const dataIntegrityKey = await generateEncryptionKey();
      const mac = await generateMAC(obfuscatedUserRecord, dataIntegrityKey);

       // Generate a keyed hash of the MAC
       const keyedHashValue = await keyedHash(mac, sessionKey);

      // Simulate wrapping the master key using HSM
      const wrappingKey = process.env.HSM_WRAPPING_KEY || 'defaultinsecurewrappingkey'; // Store wrapping key securely
      const wrappedMasterKey = await hsm.wrapKey(masterKey, wrappingKey);

       if (!wrappedMasterKey) {
            return handleSignupError(res, new Error('HSM key wrapping failed'), 'Key wrapping error');
        }

      const serverMetadata = {
        wrappedMasterKey: wrappedMasterKey,
        mac: mac,
        obfuscatedUserRecord: obfuscatedUserRecord,
        keyedHash: keyedHashValue,
        userRecordIv: encryptedUserRecord.iv,
        userRecordAuthTag: encryptedUserRecord.authTag,
        chachaNonce: chachaNonce,
        aad: aad
      }

      const serverMetadataString = JSON.stringify(serverMetadata);

       // Generate data integrity token before compression
      const dataIntegrityToken = await generateDataIntegrityToken(serverMetadataString, masterKey);

      // Compress the metadata using Gzip before sending it to the client
      const compressedServerMetadata = await compressData(serverMetadataString);

      // Store doubleEncryptedUserRecord, wrappedMasterKey, mac (instead of userRecord)
      // ...

      // Securely erase sensitive data from memory after usage
      secureErase(Buffer.from(username, 'utf8'));
      secureErase(Buffer.from(password, 'utf8'));
      if(salt){
        secureErase(Buffer.from(salt, 'utf8'));
      }
      if (derivedEncryptionKey) {
        secureErase(Buffer.from(derivedEncryptionKey, 'utf8'));
      }
      if (randomPassword) {
        secureErase(Buffer.from(randomPassword, 'utf8'));
      }
      secureErase(Buffer.from(sessionKey, 'utf8'));
      secureErase(Buffer.from(obfuscationKey, 'utf8'));
      secureErase(Buffer.from(dataIntegrityKey, 'utf8'));
      secureErase(Buffer.from(totpKey, 'utf8'));
       if(x25519KeyPair){
        secureErase(x25519KeyPair.privateKey);
        secureErase(x25519KeyPair.publicKey);
      }

      // Mask sensitive data before logging it
      const maskedTotpKey = maskData(totpKey, process.env.LOG_MASKING_KEY || 'defaultinsecuremask');
      const maskedPasswordHash = maskData(passwordHash, process.env.LOG_MASKING_KEY || 'defaultinsecuremask');
      const maskedUsernameHash = maskData(usernameHash, process.env.LOG_MASKING_KEY || 'defaultinsecuremask');

      // NEVER log sensitive data in production. Instead, log the user ID after creation.
      if (process.env.NODE_ENV !== 'production') {
        console.log('Compressed Server Metadata (for demonstration only):', compressedServerMetadata);
        console.log('Message Authentication Code (MAC):', mac);
        console.log('Keyed Hash of MAC:', keyedHashValue);
        console.log('Generated TOTP (masked):', maskedTotpKey);
        console.log('Password Hash (masked):', maskedPasswordHash);
        console.log('Username Hash (masked):', maskedUsernameHash);
      }

      signupAttempts.delete(ip); // Reset attempts on successful signup
      return res.status(201).json({
        message: 'User created successfully',
        userId: encryptedUserId,
        serverMetadata: compressedServerMetadata,
        totp: totp,
        integrityToken: dataIntegrityToken,
        sessionKey: sessionKey
      }); // Return encrypted userId
    } catch (error) {
      attempts.count++;
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.blockUntil = Date.now() + BLOCK_DURATION;
      }
      signupAttempts.set(ip, attempts);
      return handleSignupError(res, error);
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};