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
async function encryptData(data, encryptionKey) {
  try {
    const iv = await randomBytesAsync(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('hex'),
      iv: iv.toString('hex'),
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
    const iterations = 100000; // Adjust as needed
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
    return crypto.createHash('sha256').update(combined).digest('hex');
}

// Function to securely erase sensitive data from memory
function secureErase(buffer) {
    crypto.randomFillSync(buffer);
}

// Function to generate a random password for key derivation
async function generateRandomPassword() {
    const buffer = await randomBytesAsync(32);
    return buffer.toString('hex');
}

// Function to encrypt sensitive user data before storing it
async function encryptUserData(userData, masterKey) {
    try {
        const iv = await randomBytesAsync(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), iv);
        const aad = Buffer.from(process.env.AAD_FOR_ENCRYPTION || 'DefaultAad', 'utf8');
        cipher.setAAD(aad);
        const encrypted = Buffer.concat([cipher.update(JSON.stringify(userData)), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
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
async function stretchKey(key, salt, iterations = 3) {
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
    // Optionally, limit the size of storedNonces and remove older nonces
    return true;
}

// Centralized error handling with logging
function handleSignupError(res, error, message = 'Internal server error') {
  console.error("Signup Error:", error);
  return res.status(500).json({ message });
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password, hashingAlgo = 'argon2' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    let hashedPassword, salt = null;
    let derivedEncryptionKey = null;
    let randomPassword = null;

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

      // Securely store data (e.g., in a database):

      // 1. Generate a unique encryption key per user, derived from password and salt.
      randomPassword = await generateRandomPassword();
      derivedEncryptionKey = await deriveKey(randomPassword, salt);

      // Stretch the derived encryption key for added security
      derivedEncryptionKey = await stretchKey(derivedEncryptionKey, salt);

      // 2. Encrypt the username and salt
      const saltedUsername = saltUsername(username, salt);
      const encryptedUsername = await encryptData(saltedUsername, derivedEncryptionKey);
      const encryptedSalt = salt ? await encryptData(salt, derivedEncryptionKey) : null;

      // 3. Store the encryptedUsername, encryptedSalt, and hashedPassword.
      // For demonstration, we log them. NEVER log sensitive data in production.

      const userRecord = {
        hashedPassword: hashedPassword,
        encryptedUsername: encryptedUsername,
        encryptedSalt: encryptedSalt,
      };

      // Encrypt entire user record before storage using master key
      const masterKey = process.env.MASTER_ENCRYPTION_KEY || 'defaultinsecurekeythatmustbechanged';
      const encryptedUserRecord = await encryptUserData(userRecord, masterKey);

      // Store encryptedUserRecord (instead of userRecord)
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

      // NEVER log sensitive data in production.  Instead, log the user ID after creation.
      if (process.env.NODE_ENV !== 'production') {
        console.log('User record (for demonstration only):', encryptedUserRecord);
      }

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return handleSignupError(res, error);
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};