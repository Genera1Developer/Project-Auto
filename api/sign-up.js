//sign-up.js
const crypto = require('crypto');
const scrypt = require('scrypt-kdf');
const argon2 = require('argon2');
const timingSafeCompare = require('tsscmp');

const SCRYPT_CONFIG = {
  cost: 16384,
  blockSizeFactor: 8,
  parallelizationFactor: 1,
  maxMemory: 67108864,
};

async function hashPasswordScrypt(password, salt) {
  const derivedKey = await scrypt.scrypt(password, salt, SCRYPT_CONFIG);
  return derivedKey.toString('hex');
}

async function hashPasswordArgon2(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memory: 2**16,
      timeCost: 2,
      parallelism: 1,
      secret: Buffer.from(process.env.ARGON2_SECRET || ''), // optional secret
      salt: Buffer.from(crypto.randomBytes(16)) // Explicit salt generation
    });
  } catch (err) {
    console.error(err);
    throw new Error('Argon2 hashing failed');
  }
}

function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

function timingSafeEqual(a, b) {
  return timingSafeCompare(a, b);
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
        salt = generateSalt();
        hashedPassword = await hashPasswordScrypt(password, salt);
      } else if (hashingAlgo === 'argon2'){
        hashedPassword = await hashPasswordArgon2(password);
      }
      else{
        return res.status(400).json({ message: 'Invalid hashing algorithm'});
      }

    // Store username, salt, and hashedPassword securely in a database.
    // For demonstration purposes, we'll just log them.
      console.log('Username:', username);
      if (salt){
        console.log('Salt:', salt);
      }
      console.log('Hashed Password:', hashedPassword);

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error("Error during password hashing:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};