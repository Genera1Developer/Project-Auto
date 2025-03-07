const express = require('express');
const fs = require('fs');
const path = require('path');
const { access, appendFile, readFile } = require('fs/promises');

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt'); // Define log file path

// Function to read logs from file
const readLogs = async () => {
  try {
    await access(logFilePath);
    const logs = await readFile(logFilePath, 'utf8');
    return logs;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return "Log file not found.";
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
    await appendFile(logFilePath, logData + '\n');
    res.status(200).send("Log appended successfully.");
  } catch (err) {
    console.error("Error appending to logs:", err);
    return res.status(500).send("Error appending to logs.");
  }
});

module.exports = router;