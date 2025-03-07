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
                console.log('Log directory created:', logDirectory); // Optional: Log directory creation
            } catch (mkdirErr) {
                console.error('Failed to create log directory:', mkdirErr);
                // Consider throwing the error or exiting the process if logging is critical
                throw mkdirErr; // Re-throw the error to prevent the application from running without logging.
            }
        } else {
            console.error('Failed to access log directory:', err);
            // Consider throwing the error or exiting the process if logging is critical
            throw err; // Re-throw the error to prevent the application from running without logging.
        }
    }
}


const log = async (message) => {
    if (!message) {
        console.warn('Attempted to log an empty message.');
        return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {
        await fsPromises.appendFile(logFile, logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
};

// Ensure the log directory exists on startup
(async () => {
    try {
        await ensureLogDirectoryExists();
    } catch (error) {
        console.error('Failed to initialize logging:', error);
        process.exit(1); // Exit if logging initialization fails.
    }
})();

module.exports = { log };