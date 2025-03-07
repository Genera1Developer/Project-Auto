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
                process.exit(1);
            }
        } else {
            console.error('Failed to access log directory:', err);
            process.exit(1);
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

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Attempt to log the error to a file, if possible
    fs.appendFile(logFile, `Uncaught Exception: ${err.stack}\n`, (fileErr) => {
        if (fileErr) {
            console.error('Failed to write uncaught exception to log file:', fileErr);
        }
        process.exit(1); // Exit the process after logging the error
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Attempt to log the error to a file, if possible
    fs.appendFile(logFile, `Unhandled Rejection: ${reason}\n`, (fileErr) => {
        if (fileErr) {
            console.error('Failed to write unhandled rejection to log file:', fileErr);
        }
        process.exit(1); // Exit the process after logging the error
    });
});

module.exports = { log };