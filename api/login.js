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
        const sessionString = JSON.stringify(sessionData);
        const cipherText = Buffer.from(sessionString, 'utf8');
        let encrypted = cipher.update(cipherText);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Session encryption error:', error);
        return null;
    }
};

const decryptSession = (encryptedSession, encryptionKey) => {
    try {
        const encryptedSessionBuffer = Buffer.from(encryptedSession, 'hex');
        const iv = encryptedSessionBuffer.slice(0, 16);
        const authTag = encryptedSessionBuffer.slice(16, 32);
        const encryptedData = encryptedSessionBuffer.slice(32);

        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
        console.error('Session decryption error:', error);
        return null;
    }
};

const storeFailedLoginAttempt = (username) => {
    if (!global.failedLoginAttempts) {
        global.failedLoginAttempts = {};
    }

    global.failedLoginAttempts[username] = (global.failedLoginAttempts[username] || 0) + 1;
};

const checkFailedLoginAttempts = (username) => {
    return (global.failedLoginAttempts && global.failedLoginAttempts[username]) || 0;
};

const clearFailedLoginAttempts = (username) => {
    if (global.failedLoginAttempts && global.failedLoginAttempts[username]) {
        delete global.failedLoginAttempts[username];
    }
};

const generateNonce = () => {
    return crypto.randomBytes(16).toString('hex');
};

const verifyNonce = (nonce, session) => {
    if (!session || session.nonce !== nonce) {
        return false;
    }
    return true;
};

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};

const hkdfExpand = (secret, info, length) => {
    try {
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(info);
        const prk = hmac.digest();

        let t = Buffer.alloc(0);
        let okm = Buffer.alloc(0);

        for (let i = 1; okm.length < length; i++) {
            const hmac = crypto.createHmac('sha256', prk);
            hmac.update(t);
            hmac.update(info);
            hmac.update(Buffer.from([i]));
            t = hmac.digest();
            okm = Buffer.concat([okm, t]);
        }

        return okm.slice(0, length);

    } catch (error) {
        console.error('HKDF Expand Error:', error);
        return null;
    }
};

const encryptCookie = (cookieValue, encryptionKey) => {
    try {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        const cookieBuffer = Buffer.from(cookieValue, 'utf8');
        let encrypted = cipher.update(cookieBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Cookie encryption error:', error);
        return null;
    }
};

const decryptCookie = (encryptedCookie, encryptionKey) => {
    try {
        const encryptedCookieBuffer = Buffer.from(encryptedCookie, 'hex');
        const iv = encryptedCookieBuffer.slice(0, 12);
        const authTag = encryptedCookieBuffer.slice(12, 28);
        const encryptedData = encryptedCookieBuffer.slice(28);

        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Cookie decryption error:', error);
        return null;
    }
};

const hashIpAddress = (ipAddress, salt) => {
    try {
        const hmac = crypto.createHmac('sha256', salt);
        hmac.update(ipAddress);
        return hmac.digest('hex');
    } catch (error) {
        console.error('IP hashing error:', error);
        return null;
    }
};

const isRateLimitedPerUser = (req, username) => {
    const now = Date.now();
    const windowMs = 60000;
    const maxRequests = 5;
    const ipHashSalt = process.env.IP_HASH_SALT || crypto.randomBytes(16).toString('hex');
    const hashedUsername = hashIpAddress(username + req.ip, ipHashSalt);

    if (!global.userRateLimits) {
        global.userRateLimits = {};
    }

    if (!global.userRateLimits[hashedUsername]) {
        global.userRateLimits[hashedUsername] = { requests: [] };
    }

    global.userRateLimits[hashedUsername].requests = global.userRateLimits[hashedUsername].requests.filter(
        (time) => time > now - windowMs
    );

    if (global.userRateLimits[hashedUsername].requests.length >= maxRequests) {
        return true;
    }

    global.userRateLimits[hashedUsername].requests.push(now);
    return false;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {

    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    username = sanitizeInput(username);

    const failedAttempts = checkFailedLoginAttempts(username);
    if (failedAttempts >= 3) {
        return res.status(429).json({ message: 'Account locked due to multiple failed login attempts.' });
    }

    if (isRateLimitedPerUser(req, username)) {
      return res.status(429).json({ message: 'Too many requests for this user' });
    }

    try {
      const userData = await fetchUser(username);

      if (!userData) {
          storeFailedLoginAttempt(username);
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const hashedPassword = encryptPassword(password, userData.salt);
      if(!hashedPassword) {
          return res.status(500).json({ message: 'Encryption error' });
      }

      if (timingSafeCompare(hashedPassword, userData.passwordHash)) {
        clearFailedLoginAttempts(username);

        const nonce = generateNonce();
        const sessionData = {
          username: userData.username,
          loginTime: Date.now(),
          nonce: nonce
        };

        const baseEncryptionKey = process.env.SESSION_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
        const sessionId = generateSessionId();
        const encryptionKeyInfo = `SessionKey-${sessionId}`;
        const encryptionKey = hkdfExpand(Buffer.from(baseEncryptionKey, 'hex'), encryptionKeyInfo, 32);

        if (!encryptionKey) {
            return res.status(500).json({message: 'Failed to generate encryption key'});
        }

        const encryptedSession = encryptSession(sessionData, encryptionKey.toString('hex'));

        if (encryptedSession) {
            const encryptedSessionCookie = encryptCookie(encryptedSession, encryptionKey.toString('hex'));

            if (encryptedSessionCookie) {
                res.setHeader('Set-Cookie', `session=${encryptedSessionCookie}; HttpOnly; Secure; SameSite=Strict`);
                res.status(200).json({ message: 'Login successful!', nonce: nonce, sessionId: sessionId });
            } else {
                res.status(500).json({ message: 'Session cookie encryption failed' });
            }

        } else {
          res.status(500).json({ message: 'Session encryption failed' });
        }

      } else {
        storeFailedLoginAttempt(username);
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