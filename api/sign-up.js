//sign-up.js
const crypto = require('crypto');
const scrypt = require('scrypt-kdf');
const argon2 = require('argon2');
const timingSafeCompare = require('tsscmp');
const { promisify } = require('util');

const SCRYPT_CONFIG = {
  cost: 16384,
  blockSizeFactor: 8,
  parallelizationFactor: 1,
  maxMemory: 67108864,
};

const randomBytesAsync = promisify(crypto.randomBytes);

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
    const decipher = crypto.createCipheriv('chacha20-poly1305', Buffer.from(key, 'hex'), Buffer.from(nonce, 'hex'));
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
      userId = await generateUserId();

      // Securely store data (e.g., in a database):

      // 1. Generate a unique encryption key per user, derived from password and salt.
      randomPassword = await generateRandomPassword();
      derivedEncryptionKey = await deriveKey(password, salt); //Derive key from user's pw

      // Stretch the derived encryption key for added security
      derivedEncryptionKey = await stretchKey(derivedEncryptionKey, salt, 5);

      // Generate a session key
      const sessionKey = await generateSessionKey();

      // Encrypt derived key using session key
      const { encryptedDerivedKey, iv: derivedKeyIv, authTag: derivedKeyAuthTag } = await encryptDerivedKey(derivedEncryptionKey, sessionKey);

      // 2. Encrypt the username and salt
      const saltedUsername = saltUsername(username, salt);

      // Generate operation salts
      const usernameOpSalt = await generateOperationSalt();
      const saltOpSalt = await generateOperationSalt();

      const encryptedUsername = await encryptData(saltedUsername, derivedEncryptionKey + usernameOpSalt); // Use operation salt
      const encryptedSalt = salt ? await encryptData(salt, derivedEncryptionKey + saltOpSalt) : null; // Use operation salt

      // 3. Store the encryptedUsername, encryptedSalt, and hashedPassword.
      // For demonstration, we log them. NEVER log sensitive data in production.

      const userRecord = {
        userId: userId,
        hashedPassword: hashedPassword,
        encryptedUsername: encryptedUsername,
        encryptedSalt: encryptedSalt,
        usernameHash: hashWithSHA384(username), // Store username hash
        encryptedDerivedKey: encryptedDerivedKey,  // Store encrypted key
        derivedKeyIv: derivedKeyIv,           // Store initialization vector
        derivedKeyAuthTag: derivedKeyAuthTag    // Store authentication tag
      };

      // Encrypt entire user record before storage using master key
      const masterKey = process.env.MASTER_ENCRYPTION_KEY || 'defaultinsecurekeythatmustbechanged';
      const userRecordOpSalt = await generateOperationSalt();
      const encryptedUserRecord = await encryptUserData(userRecord, masterKey + userRecordOpSalt);

      // Apply an extra layer of encryption with Chacha20
      const chachaNonce = await generateNonce();
      const doubleEncryptedUserRecord = await chachaEncrypt(JSON.stringify(encryptedUserRecord), masterKey, chachaNonce);

      // Store doubleEncryptedUserRecord (instead of userRecord)
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

      // NEVER log sensitive data in production.  Instead, log the user ID after creation.
      if (process.env.NODE_ENV !== 'production') {
        console.log('User record (for demonstration only):', doubleEncryptedUserRecord);
      }

      signupAttempts.delete(ip); // Reset attempts on successful signup
      return res.status(201).json({ message: 'User created successfully', userId: userId }); // Return userID
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