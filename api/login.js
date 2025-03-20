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
    const salt = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // Fixed salt for test user
    const passwordHash = '7c44e9e53ea1951b95740c8364a95c757bb64b3449766db539693de67d3554109f33621e148305443d3586e4f9d46e0a4615a680320d9f863503c62e2169f690'; //Fixed password hash
    return {
      username: 'testuser',
      passwordHash: passwordHash,
      salt: salt,
    };
  }
  return null;
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return '';
    }
    return input.replace(/[^a-zA-Z0-9]/g, '');
};

const isRateLimited = (req) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;

  if (!req.rateLimit) {
    req.rateLimit = {
      requests: [],
    };
  }

  req.rateLimit.requests = req.rateLimit.requests.filter(
    (time) => time > now - windowMs
  );

  if (req.rateLimit.requests.length >= maxRequests) {
    return true;
  }

  req.rateLimit.requests.push(now);
  return false;
};

const encryptSession = (sessionData, encryptionKey) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        let encrypted = cipher.update(JSON.stringify(sessionData));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Session encryption error:', error);
        return null;
    }
};

const decryptSession = (encryptedSession, encryptionKey) => {
    try {
        const parts = encryptedSession.split(':');
        if (parts.length !== 3) {
            console.error('Invalid session format');
            return null;
        }
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encryptedData = Buffer.from(parts[2], 'hex');

        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString());
    } catch (error) {
        console.error('Session decryption error:', error);
        return null;
    }
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {

    if (isRateLimited(req)) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    username = sanitizeInput(username);

    try {
      const userData = await fetchUser(username);

      if (!userData) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const hashedPassword = encryptPassword(password, userData.salt);
      if(!hashedPassword) {
          return res.status(500).json({ message: 'Encryption error' });
      }

      if (timingSafeCompare(hashedPassword, userData.passwordHash)) {
        const sessionData = {
          username: userData.username,
          loginTime: Date.now(),
        };

        const encryptionKey = process.env.SESSION_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
        const encryptedSession = encryptSession(sessionData, encryptionKey);

        if (encryptedSession) {
          res.setHeader('Set-Cookie', `session=${encryptedSession}; HttpOnly; Secure`);
          res.status(200).json({ message: 'Login successful!' });
        } else {
          res.status(500).json({ message: 'Session encryption failed' });
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