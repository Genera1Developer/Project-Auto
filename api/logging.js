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
                console.log('Log directory created:', logDirectory);
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

let loggingInitialized = false;

const log = async (message) => {
    if (!loggingInitialized) {
        console.warn('Logging not initialized. Message:', message);
        return;
    }

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

// Initialize logging
async function initializeLogging() {
    try {
        await ensureLogDirectoryExists();
        loggingInitialized = true;
        console.log('Logging initialized');
    } catch (error) {
        console.error('Failed to initialize logging:', error);
        process.exit(1); // Exit if logging initialization fails.
    }
}

// Call initializeLogging function
initializeLogging();

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    try {
        await fsPromises.appendFile(logFile, `Uncaught Exception: ${err.stack}\n`);
    } catch (fileErr) {
        console.error('Failed to write uncaught exception to log file:', fileErr);
    } finally {
        process.exit(1);
    }
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    try {
        await fsPromises.appendFile(logFile, `Unhandled Rejection: ${reason}\n`);
    } catch (fileErr) {
        console.error('Failed to write unhandled rejection to log file:', fileErr);
    } finally {
        process.exit(1);
    }
});

module.exports = { log };