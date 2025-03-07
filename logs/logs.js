const express = require('express');
const fs = require('fs');
const path = require('path');
const { access, appendFile, readFile } = require('fs/promises');
const crypto = require('crypto'); // Import crypto module

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt'); // Define log file path
const encryptionKey = process.env.LOG_ENCRYPTION_KEY; // Store key securely. Use environment variable.
const algorithm = 'aes-256-gcm'; // Choose strong encryption algorithm
const IV_LENGTH = 12; // Constant IV length
const AUTH_TAG_LENGTH = 16;

if (!encryptionKey) {
  console.error("FATAL: LOG_ENCRYPTION_KEY is not set. Exiting.");
  process.exit(1); // Exit if encryption key is not set
}

// Function to encrypt data
function encrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      console.warn("Invalid input for encryption.");
      return null;
    }
    const iv = crypto.randomBytes(IV_LENGTH); // Generate initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    const ciphertext = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null; // Or throw the error if you want to halt the process
  }
}

// Function to decrypt data
function decrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      console.warn("Invalid input for decryption.");
      return null; // or throw an error/log a warning, handle empty/null input gracefully
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

    const decipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Handle decryption errors gracefully. Do not reveal sensitive information.
  }
}


// Function to read logs from file, decrypting each entry
const readLogs = async () => {
  try {
    await access(logFilePath);
    const encryptedLogs = await readFile(logFilePath, 'utf8');
    const encryptedLogArray = encryptedLogs.trim().split('\n'); // Split into lines
    const decryptedLogs = encryptedLogArray.map(log => {
      if (!log) return ""; // Handle empty logs.

      const decrypted = decrypt(log);
      return decrypted === null ? "Decryption Error" : decrypted;
    }).join('\n'); // Decrypt each line
    return decryptedLogs;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return ""; // Return empty string if log file doesn't exist. Avoids error message on first run.
    }
    console.error("Error reading logs:", err);
    return "Error reading logs.";
  }
};

// Route to serve the logs
router.get('/', async (req, res) => {
  try {
    const logs = await readLogs();
    res.setHeader('Content-Type', 'text/html'); // Set content type to HTML
    res.send(`<pre>${escapeHTML(logs)}</pre>`); // Serve logs in preformatted text, escape HTML
  } catch (error) {
    console.error("Error serving logs:", error);
    res.status(500).send("Error serving logs.");
  }
});

// Route to append to the logs (example - adjust as needed based on security.js)
router.post('/append', async (req, res) => {
  const logData = req.body.log;

  if (!logData) {
    return res.status(400).send("No log data provided.");
  }

  try {
    const encryptedLogData = encrypt(logData); // Encrypt the log data
    if (encryptedLogData === null) {
      return res.status(500).send("Error encrypting log data.");
    }
    await appendFile(logFilePath, encryptedLogData + '\n');
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