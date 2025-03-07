const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const logDirectory = path.join(__dirname, '../logs');
const logFile = path.join(logDirectory, 'proxy.log');

const fsPromises = {
    appendFile: promisify(fs.appendFile),
    mkdir: promisify(fs.mkdir),
    access: promisify(fs.access),
};

let loggingInitialized = false;

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
        }
    }
}

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

async function initializeLogging() {
    try {
        await ensureLogDirectoryExists();
        loggingInitialized = true;
        console.log('Logging initialized');
    } catch (error) {
        console.error('Failed to initialize logging:', error);
    }
}

(async () => {
    try {
        await initializeLogging();
    } catch (error) {
        console.error('Failed to initialize logging during startup:', error);
    }
})();

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    try {
        await log(`Uncaught Exception: ${err.stack}`);
    } catch (fileErr) {
        console.error('Failed to write uncaught exception to log file:', fileErr);
    } finally {
        // Ensure the process exits, even if logging fails
        process.exit(1);
    }
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    try {
        await log(`Unhandled Rejection: ${reason}`);
    } catch (fileErr) {
        console.error('Failed to write unhandled rejection to log file:', fileErr);
    }
});

const shutdownHandler = async (signal) => {
    console.log(`Received ${signal}.  Closing log stream and exiting.`);
    try {
        await log(`Process terminated with signal ${signal}`);
    } catch (err) {
        console.error('Failed to log shutdown signal:', err);
    } finally {
        process.exit(0);
    }
};

process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);
process.on('SIGHUP', shutdownHandler); //Catch SIGHUP

process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

module.exports = { log };