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