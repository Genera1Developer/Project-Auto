const crypto = require('crypto');
const otplib = require('otplib');

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
      twoFactorSecret: 'JBSWY3DPEHPKDDQMRGGEQSKF',
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

const generate2FASecret = () => {
    return crypto.randomBytes(20).toString('base32');
};

const verify2FACode = (secret, token) => {
    try {
        otplib.authenticator.options = {
            window: [1, 1]
        };
        return otplib.authenticator.verify({ secret, token });
    } catch (error) {
        console.error('2FA verification error:', error);
        return false;
    }
};

const generateDeviceSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

const encryptWithDeviceSecret = (data, deviceSecret) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(deviceSecret, 'hex'), iv);
        const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Encryption with device secret error:', error);
        return null;
    }
};

const decryptWithDeviceSecret = (encryptedData, deviceSecret) => {
    try {
        const encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
        const iv = encryptedDataBuffer.slice(0, 16);
        const authTag = encryptedDataBuffer.slice(16, 32);
        const data = encryptedDataBuffer.slice(32);

        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(deviceSecret, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
        console.error('Decryption with device secret error:', error);
        return null;
    }
};

const generateShortLivedToken = (username, secret) => {
    const payload = {
        username: username,
        timestamp: Date.now()
    };
    const payloadString = JSON.stringify(payload);

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
        const dataBuffer = Buffer.from(payloadString, 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Short lived token generation error:', error);
        return null;
    }
};

const verifyShortLivedToken = (token, secret) => {
    try {
        const encryptedDataBuffer = Buffer.from(token, 'hex');
        const iv = encryptedDataBuffer.slice(0, 16);
        const authTag = encryptedDataBuffer.slice(16, 32);
        const data = encryptedDataBuffer.slice(32);

        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const payload = JSON.parse(decrypted.toString('utf8'));

        const now = Date.now();
        const tokenAge = now - payload.timestamp;
        const maxTokenAge = 60000; // 1 minute

        if (tokenAge > maxTokenAge) {
            return false;
        }

        return payload.username; // Return username if valid
    } catch (error) {
        console.error('Short lived token verification error:', error);
        return null;
    }
};

const generateAuthenticationToken = (username, encryptionKey) => {
    try {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };
        const payload = {
            username: username,
            iat: Date.now()
        };

        const headerString = JSON.stringify(header);
        const payloadString = JSON.stringify(payload);

        const encodedHeader = Buffer.from(headerString).toString('base64url');
        const encodedPayload = Buffer.from(payloadString).toString('base64url');

        const data = `${encodedHeader}.${encodedPayload}`;

        const hmac = crypto.createHmac('sha256', encryptionKey);
        hmac.update(data);
        const signature = hmac.digest('base64url');

        return `${data}.${signature}`;

    } catch (error) {
        console.error('Authentication token generation error:', error);
        return null;
    }
};

const verifyAuthenticationToken = (token, encryptionKey) => {
    try {
        const [encodedHeader, encodedPayload, signature] = token.split('.');

        const data = `${encodedHeader}.${encodedPayload}`;

        const hmac = crypto.createHmac('sha256', encryptionKey);
        hmac.update(data);
        const expectedSignature = hmac.digest('base64url');

        if (signature !== expectedSignature) {
            return null;
        }

        const payloadString = Buffer.from(encodedPayload, 'base64url').toString('utf8');
        const payload = JSON.parse(payloadString);

        return payload.username;

    } catch (error) {
        console.error('Authentication token verification error:', error);
        return null;
    }
};

const xorEncrypt = (data, key) => {
    const keyBuffer = Buffer.from(key, 'utf8');
    const dataBuffer = Buffer.from(data, 'utf8');
    const result = Buffer.alloc(dataBuffer.length);

    for (let i = 0; i < dataBuffer.length; i++) {
        result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return result.toString('hex');
};

const xorDecrypt = (encryptedData, key) => {
    const keyBuffer = Buffer.from(key, 'utf8');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
    const result = Buffer.alloc(encryptedDataBuffer.length);

    for (let i = 0; i < encryptedDataBuffer.length; i++) {
        result[i] = encryptedDataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return result.toString('utf8');
};

const generateEncryptionKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const generateKeyMaterial = (password, salt) => {
    try {
        const iterations = 3;
        const keylen = 32;
        const digest = 'sha256';
        const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
        return derivedKey;
    } catch (error) {
        console.error('Key material generation error:', error);
        return null;
    }
};

const encryptWithKeyMaterial = (data, keyMaterial) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, iv);
        const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Encryption with key material error:', error);
        return null;
    }
};

const decryptWithKeyMaterial = (encryptedData, keyMaterial) => {
    try {
        const encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
        const iv = encryptedDataBuffer.slice(0, 16);
        const authTag = encryptedDataBuffer.slice(16, 32);
        const data = encryptedDataBuffer.slice(32);

        const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
        console.error('Decryption with key material error:', error);
        return null;
    }
};

const hmacSign = (data, key) => {
    try {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest('hex');
    } catch (error) {
        console.error('HMAC signing error:', error);
        return null;
    }
};

const generateRandomIV = () => {
    return crypto.randomBytes(16);
};

const encryptData = (data, key, iv) => {
    try {
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return { encryptedData: encrypted, authTag: authTag.toString('hex') };
    } catch (error) {
        console.error('Data encryption error:', error);
        return null;
    }
};

const decryptData = (encryptedData, key, iv, authTag) => {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Data decryption error:', error);
        return null;
    }
};

const encryptObject = (obj, key) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const jsonString = JSON.stringify(obj);
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return { iv: iv.toString('hex'), encryptedData: encrypted, authTag: authTag.toString('hex') };
    } catch (error) {
        console.error('Object encryption error:', error);
        return null;
    }
};

const decryptObject = (encrypted, key) => {
    try {
        const iv = Buffer.from(encrypted.iv, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Object decryption error:', error);
        return null;
    }
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {

    let { username, password, twoFactorToken } = req.body;

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

        // 2FA Verification
        if (userData.twoFactorSecret) {
            if (!twoFactorToken) {
                return res.status(401).json({ message: 'Two-factor authentication required' });
            }

            const is2FAValid = verify2FACode(userData.twoFactorSecret, twoFactorToken);
            if (!is2FAValid) {
                return res.status(401).json({ message: 'Invalid two-factor token' });
            }
        }

        const nonce = generateNonce();
        const sessionId = generateSessionId();
        const sessionData = {
          username: userData.username,
          loginTime: Date.now(),
          nonce: nonce,
          sessionId: sessionId,
          ipAddress: req.ip //Include IP
        };

        // Generate key material
        const keyMaterial = generateKeyMaterial(password, userData.salt);

        if (!keyMaterial) {
            return res.status(500).json({ message: 'Failed to generate key material' });
        }

        // Enhanced session encryption using encryptObject
        const encryptedSession = encryptObject(sessionData, keyMaterial);

        if (!encryptedSession) {
            return res.status(500).json({ message: 'Session encryption failed' });
        }

        const encryptedSessionCookieValue = JSON.stringify(encryptedSession);
        const encryptedSessionCookie = encryptCookie(encryptedSessionCookieValue, keyMaterial.toString('hex'));

        if (encryptedSessionCookie) {
                const deviceSecret = generateDeviceSecret();
                const encryptedDeviceSecret = encryptWithDeviceSecret({secret: deviceSecret}, keyMaterial.toString('hex'))

                // Generate a short-lived token
                const shortLivedToken = generateShortLivedToken(userData.username, keyMaterial.toString('hex'));

                // Generate authentication token
                const authToken = generateAuthenticationToken(userData.username, keyMaterial.toString('hex'));

                const xorKey = generateEncryptionKey();
                const xorEncryptedSessionId = xorEncrypt(sessionId, xorKey);

                // Sign the session ID using HMAC
                const sessionIdSignature = hmacSign(sessionId, keyMaterial.toString('hex'));

                res.setHeader('Set-Cookie', `session=${encryptedSessionCookie}; HttpOnly; Secure; SameSite=Strict`);

                const responsePayload = {
                    message: 'Login successful!',
                    nonce: nonce,
                    sessionId: xorEncryptedSessionId,
                    deviceSecret: encryptedDeviceSecret,
                    token: shortLivedToken,
                    authToken: authToken,
                    xorKey: xorKey,
                    sessionIdSignature: sessionIdSignature
                };

                // Encrypt the response payload
                const encryptedResponse = encryptObject(responsePayload, keyMaterial);

                if(!encryptedResponse) {
                    return res.status(500).json({message: "Response encryption failed"});
                }

                const finalEncryptedResponse = encryptData(JSON.stringify(encryptedResponse), keyMaterial, generateRandomIV());

                if(!finalEncryptedResponse) {
                    return res.status(500).json({message: "Final response encryption failed"});
                }

                res.status(200).json(finalEncryptedResponse);


            } else {
                res.status(500).json({ message: 'Session cookie encryption failed' });
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