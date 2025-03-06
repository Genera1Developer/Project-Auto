const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const logDirectory = path.join(__dirname, '../logs');

// Use fs.promises for asynchronous file operations
const fsPromises = {
  appendFile: promisify(fs.appendFile),
  mkdir: promisify(fs.mkdir),
  exists: promisify(fs.exists),
};

async function ensureLogDirectoryExists() {
  if (!(await fsPromises.exists(logDirectory))) {
    await fsPromises.mkdir(logDirectory, { recursive: true });
  }
}

const logFile = path.join(logDirectory, 'proxy.log');

const log = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    await fsPromises.appendFile(logFile, logMessage);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
};

// Ensure the log directory exists on startup
ensureLogDirectoryExists();

module.exports = { log };