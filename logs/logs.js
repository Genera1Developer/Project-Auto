const express = require('express');
const fs = require('fs');
const path = require('path');
const { access, appendFile, readFile } = require('fs/promises');
const crypto = require('crypto'); // Import crypto module

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt'); // Define log file path
const encryptionKey = process.env.LOG_ENCRYPTION_KEY || 'default_encryption_key'; // Store key securely. Use environment variable.
const algorithm = 'aes-256-cbc'; // Choose strong encryption algorithm

// Function to encrypt data
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data
function decrypt(text) {
  try {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error);
    return "Decryption Error"; // Handle decryption errors gracefully.  Do not reveal sensitive information.
  }
}


// Function to read logs from file, decrypting each entry
const readLogs = async () => {
  try {
    await access(logFilePath);
    const encryptedLogs = await readFile(logFilePath, 'utf8');
    const encryptedLogArray = encryptedLogs.trim().split('\n'); // Split into lines
    const decryptedLogs = encryptedLogArray.map(log => decrypt(log)).join('\n'); // Decrypt each line
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
    await appendFile(logFilePath, encryptedLogData + '\n');
    res.status(200).send("Log appended successfully.");
  } catch (err) {
    console.error("Error appending to logs:", err);
    return res.status(500).send("Error appending to logs.");
  }
});

module.exports = router;