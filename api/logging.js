const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const logDirectory = path.join(__dirname, '../logs');
const logFile = path.join(logDirectory, 'proxy.log');

// Use fs.promises for asynchronous file operations
const fsPromises = {
    appendFile: promisify(fs.appendFile),
    mkdir: promisify(fs.mkdir),
    access: promisify(fs.access),
};

async function ensureLogDirectoryExists() {
    try {
        await fsPromises.access(logDirectory);
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                await fsPromises.mkdir(logDirectory, { recursive: true });
            } catch (mkdirErr) {
                console.error('Failed to create log directory:', mkdirErr);
                // Consider throwing the error or exiting the process if logging is critical
            }
        } else {
            console.error('Failed to access log directory:', err);
            // Consider throwing the error or exiting the process if logging is critical
        }
    }
}


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