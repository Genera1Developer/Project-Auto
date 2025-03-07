const express = require('express');
const fs = require('fs');
const path = require('path');
const { access, appendFile, readFile } = require('fs/promises');
const crypto = require('crypto'); // Import crypto module

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt'); // Define log file path
const encryptionKey = process.env.LOG_ENCRYPTION_KEY; // Store key securely. Use environment variable.
const algorithm = 'aes-256-cbc'; // Choose strong encryption algorithm
const IV_LENGTH = 16; // Constant IV length

if (!encryptionKey) {
  console.error("FATAL: LOG_ENCRYPTION_KEY is not set. Exiting.");
  process.exit(1); // Exit if encryption key is not set
}

// Function to encrypt data
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH); // Generate initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const ciphertext = iv.toString('hex') + ':' + encrypted.toString('hex');
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null; // Or throw the error if you want to halt the process
  }
}

// Function to decrypt data
function decrypt(text) {
  try {
    if (!text) {
      return null; // or throw an error/log a warning, handle empty/null input gracefully
    }

    const textParts = text.split(':');
    if (textParts.length < 2) {
      console.warn("Invalid ciphertext format.");
      return null;
    }

    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    if (iv.length !== IV_LENGTH) {
        console.warn("Invalid IV length.");
        return null;
    }
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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
    res.send(`<pre>${logs}</pre>`); // Serve logs in preformatted text
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

module.exports = router;