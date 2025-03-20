//sign-up.js
const crypto = require('crypto');
const scrypt = require('scrypt-kdf');

const SCRYPT_CONFIG = {
  cost: 16384,
  blockSizeFactor: 8,
  parallelizationFactor: 1,
  maxMemory: 67108864,
};

async function hashPassword(password, salt) {
  const derivedKey = await scrypt.scrypt(password, salt, SCRYPT_CONFIG);
  return derivedKey.toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Store username, salt, and hashedPassword securely in a database.
    // For demonstration purposes, we'll just log them.
    console.log('Username:', username);
    console.log('Salt:', salt);
    console.log('Hashed Password:', hashedPassword);

    return res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};