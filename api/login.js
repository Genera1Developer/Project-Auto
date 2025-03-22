const crypto = require('crypto');
const otplib = require('otplib');
const zlib = require('zlib');

const generateSalt = () => {
  return crypto.randomBytes(32).toString('hex');
};

const encryptPassword = (password, salt) => {
  const iterations = 310000;
  const keylen = 64;
  const digest = 'sha512';
  let derivedKey = null;
  try {
    derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
    return derivedKey.toString('hex');
  } catch (error) {
    console.error('Password encryption error:', error);
    return null;
  } finally {
    if(password){
        crypto.randomFillSync(Buffer.from(password, 'utf-8'), 0, Buffer.from(password, 'utf-8').length);
      password = null;
    }
  }
};

const timingSafeCompare = (a, b) => {
  if (!a || !b || typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let aBuff = null;
  let bBuff = null;

  try {
    aBuff = Buffer.from(a, 'utf-8');
    bBuff = Buffer.from(b, 'utf-8');
    return crypto.timingSafeEqual(aBuff, bBuff);
  } catch (error) {
    console.error('Timing safe compare error:', error);
    return false;
  } finally {
        if (aBuff) {
            crypto.randomFillSync(aBuff, 0, aBuff.length);
            aBuff = null;
        }
        if (bBuff) {
            crypto.randomFillSync(bBuff, 0, bBuff.length);
            bBuff = null;
        }
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
    let cipherText = null;
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        const sessionString = JSON.stringify(sessionData);
        cipherText = Buffer.from(sessionString, 'utf8');
        let encrypted = cipher.update(cipherText);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Session encryption error:', error);
        return null;
    } finally {
        if (cipherText) {
            crypto.randomFillSync(cipherText, 0, cipherText.length);
            cipherText = null;
        }
    }
};

const decryptSession = (encryptedSession, encryptionKey) => {
    let encryptedSessionBuffer = null;
    try {
        encryptedSessionBuffer = Buffer.from(encryptedSession, 'hex');
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
    } finally {
        if(encryptedSessionBuffer){
            crypto.randomFillSync(encryptedSessionBuffer, 0, encryptedSessionBuffer.length)
            encryptedSessionBuffer = null;
        }
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
    let prk = null;
    try {
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(info);
        prk = hmac.digest();

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
    } finally {
      if(prk){
        crypto.randomFillSync(prk, 0, prk.length);
        prk = null;
      }
    }
};

const encryptCookie = (cookieValue, encryptionKey) => {
    let cookieBuffer = null;
    try {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        cookieBuffer = Buffer.from(cookieValue, 'utf8');
        let encrypted = cipher.update(cookieBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Cookie encryption error:', error);
        return null;
    } finally {
        if(cookieBuffer){
            crypto.randomFillSync(cookieBuffer, 0, cookieBuffer.length);
            cookieBuffer = null;
        }
    }
};

const decryptCookie = (encryptedCookie, encryptionKey) => {
    let encryptedCookieBuffer = null;
    try {
        encryptedCookieBuffer = Buffer.from(encryptedCookie, 'hex');
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
    } finally {
        if(encryptedCookieBuffer){
            crypto.randomFillSync(encryptedCookieBuffer, 0, encryptedCookieBuffer.length);
            encryptedCookieBuffer = null;
        }
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
        const isValid = otplib.authenticator.verify({ secret, token });
	return isValid;
    } catch (error) {
        console.error('2FA verification error:', error);
        return false;
    }
};

const generateDeviceSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

const encryptWithDeviceSecret = (data, deviceSecret) => {
    let dataBuffer = null;
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(deviceSecret, 'hex'), iv);
        dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Encryption with device secret error:', error);
        return null;
    } finally {
        if (dataBuffer) {
            crypto.randomFillSync(dataBuffer, 0, dataBuffer.length);
            dataBuffer = null;
        }
    }
};

const decryptWithDeviceSecret = (encryptedData, deviceSecret) => {
    let encryptedDataBuffer = null;
    try {
        encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
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
    } finally {
        if (encryptedDataBuffer) {
            crypto.randomFillSync(encryptedDataBuffer, 0, encryptedDataBuffer.length);
            encryptedDataBuffer = null;
        }
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
    let encryptedDataBuffer = null;
    try {
        encryptedDataBuffer = Buffer.from(token, 'hex');
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
    } finally {
        if (encryptedDataBuffer) {
            crypto.randomFillSync(encryptedDataBuffer, 0, encryptedDataBuffer.length)
            encryptedDataBuffer = null;
        }
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
    let dataBuffer = null;
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, iv);
        dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('hex');
    } catch (error) {
        console.error('Encryption with key material error:', error);
        return null;
    } finally {
        if(dataBuffer){
            crypto.randomFillSync(dataBuffer, 0, dataBuffer.length);
            dataBuffer = null;
        }
    }
};

const decryptWithKeyMaterial = (encryptedData, keyMaterial) => {
    let encryptedDataBuffer = null;
    try {
        encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
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
    } finally {
        if(encryptedDataBuffer){
            crypto.randomFillSync(encryptedDataBuffer, 0, encryptedDataBuffer.length);
            encryptedDataBuffer = null;
        }
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
    let dataBuffer = null;
    try {
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        dataBuffer = Buffer.from(data, 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return { encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
    } catch (error) {
        console.error('Data encryption error:', error);
        return null;
    } finally {
        if(dataBuffer){
            crypto.randomFillSync(dataBuffer, 0, dataBuffer.length);
            dataBuffer = null;
        }
    }
};

const decryptData = (encryptedData, key, iv, authTag) => {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Data decryption error:', error);
        return null;
    }
};

const encryptObject = (obj, key) => {
    let dataBuffer = null;
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const jsonString = JSON.stringify(obj);
        dataBuffer = Buffer.from(jsonString, 'utf8');
        let encrypted = cipher.update(dataBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
    } catch (error) {
        console.error('Object encryption error:', error);
        return null;
    } finally {
        if (dataBuffer){
            crypto.randomFillSync(dataBuffer, 0, dataBuffer.length);
            dataBuffer = null;
        }
    }
};

const decryptObject = (encrypted, key) => {
    try {
        const iv = Buffer.from(encrypted.iv, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
        console.error('Object decryption error:', error);
        return null;
    }
};

const serverSecret = process.env.SERVER_SECRET || crypto.randomBytes(32).toString('hex');

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
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay
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
          ipAddress: hashIpAddress(req.ip, generateSalt())
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

        if (encryptedSession) {
                const deviceSecret = generateDeviceSecret();
                const encryptedDeviceSecret = encryptWithDeviceSecret({secret: deviceSecret}, keyMaterial.toString('hex'))

                // Generate a short-lived token
                const shortLivedToken = generateShortLivedToken(userData.username, keyMaterial.toString('hex'));

                // Generate authentication token
                const authToken = generateAuthenticationToken(userData.username, keyMaterial.toString('hex'));

                const xorKey = generateEncryptionKey();
                const xorEncryptedSessionId = xorEncrypt(sessionId, xorKey);

                // Sign the session ID using HMAC with serverSecret
                const sessionIdSignature = hmacSign(sessionId, serverSecret);

                const responsePayload = {
                    message: 'Login successful!',
                    nonce: nonce,
                    sessionId: xorEncryptedSessionId,
                    deviceSecret: encryptedDeviceSecret,
                    token: shortLivedToken,
                    authToken: authToken,
                    xorKey: xorKey,
                    sessionIdSignature: sessionIdSignature,
                    encryptedSession: encryptedSession
                };

                 // Generate a random IV for the final encryption
                 const finalEncryptionIV = generateRandomIV();
                 const finalEncryptionKey = crypto.randomBytes(32);

                 // Encrypt the response payload with a new IV each time
                 const finalEncryptedResponse = encryptData(JSON.stringify(responsePayload), finalEncryptionKey, finalEncryptionIV);

                 if (!finalEncryptedResponse) {
                     return res.status(500).json({ message: "Final response encryption failed" });
                 }

                 // Include the IV, authTag and responseHash in the response
                 const responseWithIV = {
                     iv: finalEncryptionIV.toString('hex'),
                     encryptedData: finalEncryptedResponse.encryptedData,
                     authTag: finalEncryptedResponse.authTag,
                    hash: crypto.createHash('sha256').update(JSON.stringify(responsePayload)).digest('hex') //Add Integrity Check
                 };

                 // Encode the entire response with base64url and compress it
                 const compressedResponse = zlib.deflateRawSync(JSON.stringify(responseWithIV)).toString('base64url');

                 // Set CSP header to mitigate XSS attacks
                 res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'");

                 // Mitigate response body size issues by setting the appropriate header
                 res.setHeader('Content-Encoding', 'deflate');

                 // Set Cache-Control to prevent caching of sensitive data
                 res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                 res.setHeader('Pragma', 'no-cache');
                 res.setHeader('Expires', '0');

                 const secureCookieOptions = {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    signed: true,
                    path: '/',
                    maxAge: 3600000, // Cookie expires after 1 hour (1hr * 60min * 60sec * 1000ms)
                  };

                 // Set cookie with the encrypted session ID, signing with serverSecret
                 const cookieValue = encryptCookie(sessionId, serverSecret);
                 if (!cookieValue) {
                    return res.status(500).json({ message: 'Cookie encryption failed' });
                 }
                 res.cookie('session_id', cookieValue, secureCookieOptions);
                 res.status(200).json({ data: compressedResponse });

                // Securely erase key material after use
                crypto.randomFillSync(keyMaterial, 0, keyMaterial.length);

                 // Securely erase sensitive variables
                 username = null;
                 password = null;
                 twoFactorToken = null;
                 crypto.randomFillSync(finalEncryptionKey, 0, finalEncryptionKey.length);

            } else {
                res.status(500).json({ message: 'Session encryption failed' });
            }

      } else {
        storeFailedLoginAttempt(username);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
       // Securely erase sensitive variables in case of error
       username = null;
       password = null;
       twoFactorToken = null;
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};