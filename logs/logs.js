const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const logFilePath = path.join(__dirname, 'logs.txt'); // Define log file path

// Function to read logs from file
const readLogs = () => {
  try {
    if (fs.existsSync(logFilePath)) {
      return fs.readFileSync(logFilePath, 'utf8');
    } else {
      return "Log file not found.";
    }
  } catch (err) {
    console.error("Error reading logs:", err);
    return "Error reading logs.";
  }
};

// Route to serve the logs
router.get('/', (req, res) => {
  const logs = readLogs();
  res.send(`<pre>${logs}</pre>`); // Serve logs in preformatted text
});

// Route to append to the logs (example - adjust as needed based on security.js)
router.post('/append', (req, res) => {
  const logData = req.body.log;

  if (logData) {
    fs.appendFile(logFilePath, logData + '\n', (err) => {
      if (err) {
        console.error("Error appending to logs:", err);
        return res.status(500).send("Error appending to logs.");
      }
      res.status(200).send("Log appended successfully.");
    });
  } else {
    res.status(400).send("No log data provided.");
  }
});

module.exports = router;