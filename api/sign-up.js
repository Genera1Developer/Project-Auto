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

// Function to encrypt data using AES-256-CBC
async function encryptData(data, encryptionKey) {
  const iv = await randomBytesAsync(16); // Initialization Vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password, hashingAlgo = 'argon2' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    let hashedPassword, salt = null;

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

      // 1. Generate a unique encryption key per user.
      const encryptionKey = await generateSalt();

      // 2. Encrypt the username and salt
      const encryptedUsername = await encryptData(username, encryptionKey);
      const encryptedSalt = salt ? await encryptData(salt, encryptionKey) : null;

      // 3. Store the encryptionKey, encryptedUsername, encryptedSalt, and hashedPassword.
      // For demonstration, we log them. NEVER log sensitive data in production.
      console.log('Encryption Key:', encryptionKey);
      console.log('Encrypted Username:', encryptedUsername);
      if (encryptedSalt) {
        console.log('Encrypted Salt:', encryptedSalt);
      }
      console.log('Hashed Password:', hashedPassword);

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error("Error during password hashing/encryption:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};