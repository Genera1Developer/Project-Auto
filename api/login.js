const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(64).toString('hex'); // Increased salt size
};

const encryptPassword = (password, salt) => {
  const iterations = 10000; // Increased iterations for stronger hashing
  const keylen = 64; // Key length for PBKDF2
  const digest = 'sha512'; // Algorithm for PBKDF2
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return derivedKey.toString('hex');
};

const timingSafeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a, 'utf-8'), Buffer.from(b, 'utf-8'));
};

// Mock database interaction - replace with actual DB calls
const fetchUser = async (username) => {
  // Simulate database lookup
  if (username === 'testuser') {
    const salt = generateSalt();
    const passwordHash = encryptPassword('password123', salt);
    return {
      username: 'testuser',
      passwordHash: passwordHash,
      salt: salt,
    };
  }
  return null;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const userData = await fetchUser(username);

    if (userData) {
      const hashedPassword = encryptPassword(password, userData.salt);

      if (timingSafeCompare(hashedPassword, userData.passwordHash)) {
        res.status(200).json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};