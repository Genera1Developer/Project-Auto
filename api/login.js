const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(64).toString('hex');
};

const encryptPassword = (password, salt) => {
  const iterations = 100000; // Increased iterations significantly
  const keylen = 64;
  const digest = 'sha512';
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
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'utf-8'), Buffer.from(b, 'utf-8'));
  } catch (error) {
    return false; // Handle potential buffer creation errors
  }
};

const fetchUser = async (username) => {
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

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' }); //Prevent null errors
    }

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