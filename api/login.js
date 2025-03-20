const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(32).toString('hex');
};

const encryptPassword = (password, salt) => {
  const iterations = 310000;
  const keylen = 64;
  const digest = 'sha512';
  try {
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
    return derivedKey.toString('hex');
  } catch (error) {
    console.error('Password encryption error:', error);
    return null;
  }
};

const timingSafeCompare = (a, b) => {
  if (!a || !b || typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  try {
    const aBuff = Buffer.from(a, 'utf-8');
    const bBuff = Buffer.from(b, 'utf-8');
    return crypto.timingSafeEqual(aBuff, bBuff);
  } catch (error) {
    console.error('Timing safe compare error:', error);
    return false;
  }
};

const fetchUser = async (username) => {
  if (username === 'testuser') {
    const salt = generateSalt();
    const passwordHash = encryptPassword('password123', salt);
    if (!passwordHash) return null;
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
      return res.status(400).json({ message: 'Username and password required' });
    }

    try {
      const userData = await fetchUser(username);

      if (userData) {
        const hashedPassword = encryptPassword(password, userData.salt);
        if(!hashedPassword) {
            return res.status(500).json({ message: 'Encryption error' });
        }

        if (timingSafeCompare(hashedPassword, userData.passwordHash)) {
          res.status(200).json({ message: 'Login successful!' });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};