const express = require('express');
const fs = require('fs');
const path = require('path');
const { access, appendFile, readFile } = require('fs/promises');
const crypto = require('crypto');
const helmet = require('helmet'); // Import Helmet for security headers
const rateLimit = require('express-rate-limit'); // Import rate limiter
const { body, validationResult } = require('express-validator'); // Import express-validator
const { randomUUID } = require('crypto');
const { createHmac } = require('crypto');

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt');
const encryptionKey = process.env.LOG_ENCRYPTION_KEY;
const integrityKey = process.env.LOG_INTEGRITY_KEY;
const algorithm = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

if (!encryptionKey) {
  console.error("FATAL: LOG_ENCRYPTION_KEY is not set. Exiting.");
  process.exit(1);
}

if (!integrityKey) {
    console.error("FATAL: LOG_INTEGRITY_KEY is not set. Exiting.");
    process.exit(1);
}

// Function to encrypt data
function encrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      console.warn("Invalid input for encryption.");
      return null;
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    const ciphertext = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

// Function to decrypt data
function decrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      console.warn("Invalid input for decryption.");
      return null;
    }

    const textParts = text.split(':');
    if (textParts.length < 3) {
      console.warn("Invalid ciphertext format.");
      return null;
    }

    const iv = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    if (iv.length !== IV_LENGTH) {
        console.warn("Invalid IV length.");
        return null;
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
        console.warn("Invalid authentication tag length.");
        return null;
    }

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex');
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

// Function to calculate HMAC for data integrity
function calculateHMAC(data) {
    try {
        const hmac = createHmac('sha256', integrityKey);
        hmac.update(data);
        return hmac.digest('hex');
    } catch (error) {
        console.error("HMAC calculation error:", error);
        return null;
    }
}

// Function to verify HMAC
function verifyHMAC(data, hmac) {
    try {
        const calculatedHmac = calculateHMAC(data);
        return calculatedHmac === hmac;
    } catch (error) {
        console.error("HMAC verification error:", error);
        return false;
    }
}


// Function to read logs from file, decrypting and verifying each entry
const readLogs = async () => {
  try {
    await access(logFilePath);
    const encryptedLogs = await readFile(logFilePath, 'utf8');
    const encryptedLogArray = encryptedLogs.trim().split('\n');
    const decryptedLogs = encryptedLogArray.map(log => {
      if (!log) return "";

      const parts = log.split('||HMAC||');
        if (parts.length !== 2) {
            console.warn("Log entry missing HMAC.");
            return "Integrity Check Failed: Missing HMAC";
        }

        const encryptedData = parts[0];
        const receivedHMAC = parts[1];

        const decrypted = decrypt(encryptedData);
        if (decrypted === null) {
            return "Decryption Error";
        }

        if (!verifyHMAC(decrypted, receivedHMAC)) {
            return "Integrity Check Failed: HMAC mismatch";
        }

        return decrypted;
    }).join('\n');
    return decryptedLogs;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return "";
    }
    console.error("Error reading logs:", err);
    return "Error reading logs.";
  }
};

// Security middleware - add more as necessary

// Rate limiting to prevent abuse
const logAppendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Max 10 requests per window
  message: "Too many log requests from this IP, please try again after a minute."
});

// CSP nonce generation middleware
router.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

router.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`], // Use nonce for inline scripts
    styleSrc: ["'self'", "'unsafe-inline'"], // Be cautious with 'unsafe-inline'
    imgSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
router.use(helmet.noSniff());
router.use(helmet.frameguard({ action: 'deny' }));
router.use(helmet.xssFilter());

// Route to serve the logs
router.get('/', async (req, res) => {
  try {
    const logs = await readLogs();
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logs</title>
        <meta charset="UTF-8">
      </head>
      <body>
        <pre>${escapeHTML(logs)}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error serving logs:", error);
    res.status(500).send("Error serving logs.");
  }
});

// Route to append to the logs
router.post('/append',
  logAppendLimiter, // Apply rate limiting
  [
    // Validate and sanitize the log input
    body('log').trim().isLength({ min: 1, max: 255 }).withMessage('Log message must be between 1 and 255 characters.')
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const logData = req.body.log;
    const ipAddress = req.ip; // Get IP address of the client
    const userAgent = req.get('User-Agent') || 'Unknown'; // Get User-Agent

    try {
      const logEntry = `IP: ${ipAddress} - User-Agent: ${userAgent} - ${logData}`;  // Include IP address and User-Agent in log
      const encryptedLogData = encrypt(logEntry);
        if (encryptedLogData === null) {
            return res.status(500).send("Error encrypting log data.");
        }
        const hmac = calculateHMAC(logEntry);
        if (hmac === null) {
            return res.status(500).send("Error calculating HMAC.");
        }

        const logString = encryptedLogData + '||HMAC||' + hmac;
        await appendFile(logFilePath, logString + '\n');
        res.status(200).send("Log appended successfully.");
    } catch (err) {
      console.error("Error appending to logs:", err);
      return res.status(500).send("Error appending to logs.");
    }
  });

// Helper function to escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return m;
    }
  });
}

module.exports = router;