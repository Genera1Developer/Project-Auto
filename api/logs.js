import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');
const encryptionKey = process.env.LOG_ENCRYPTION_KEY; // Store securely!
const algorithm = 'aes-256-gcm';
const keyLength = 32;

if (!encryptionKey) {
    console.warn("LOG_ENCRYPTION_KEY is not set. Logs will not be encrypted.");
} else if (Buffer.from(encryptionKey, 'utf8').length !== keyLength) {
    console.warn("LOG_ENCRYPTION_KEY should be 32 bytes (256 bits).");
}

function encrypt(text) {
    if (!encryptionKey) {
        return text; // Don't encrypt if key is missing.
    }

    try {
        const iv = crypto.randomBytes(12); // Using 12 bytes for GCM
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
        let encrypted = cipher.update(text, 'utf8'); // Explicitly specify input encoding
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
        console.error("Encryption error:", error);
        return null; // Return null on failure for better error handling
    }

}

function decrypt(text) {
    if (!encryptionKey) {
        return text; // Return original text if key is missing.
    }

    try {
        if (typeof text !== 'string') {
            console.error("Invalid log format: Log entry is not a string.");
            return null;
        }

        const textParts = text.split(':');
        if (textParts.length !== 3) {
            console.error("Invalid log format: Incorrect number of parts.");
            return null; // Return null on invalid format.
        }
        const [ivHex, authTagHex, encryptedTextHex] = textParts;

        if (!ivHex || !authTagHex || !encryptedTextHex) {
            console.error("Invalid log format: Missing parts after split.");
            return null;
        }

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encryptedText = Buffer.from(encryptedTextHex, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8'); // Explicitly specify output encoding
    } catch (error) {
        console.error("Decryption error:", error);
        return null; // Return null on decryption failure
    }
}


export async function logRequest(req, res, url) {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'N/A'; // Handle undefined case
    const logMessage = `${new Date().toISOString()} - ${req.method} ${url} - ${res.statusCode} - ${ip}\n`;
    let encryptedLogMessage;

    try {
        encryptedLogMessage = await encrypt(logMessage); // Await encryption
    } catch (error) {
        console.error("Error during encryption:", error);
        encryptedLogMessage = null; // Ensure null if encryption fails
    }

    if (!encryptedLogMessage) { // Check for null instead of string comparison
        console.error("Failed to encrypt log message. Skipping log entry.");
        return;
    }

    try {
        await fs.promises.appendFile(logFilePath, encryptedLogMessage); // Append without extra newline, already in logMessage
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
}

export async function getLogs() {
    try {
        let logs = await fs.promises.readFile(logFilePath, 'utf8');
        if (!logs) {
            return [];
        }

        const logEntries = logs.trim().split('\n').filter(log => log.trim() !== '');
        const decryptedLogs = [];

        for (const log of logEntries) {
            try {
                const decryptedLog = decrypt(log); // Remove await for synchronous decryption
                if (decryptedLog) {
                    decryptedLogs.push(decryptedLog);
                } else {
                    decryptedLogs.push("Decryption Failed: Log entry may be corrupted or the encryption key is incorrect.");
                }
            } catch (error) {
                console.error("Error during decryption:", error);
                decryptedLogs.push("Decryption Failed: Log entry may be corrupted or the encryption key is incorrect.");
            }
        }

        return decryptedLogs.reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return ["Error reading log file."];
    }
}

export async function clearLogs() {
    try {
        await fs.promises.writeFile(logFilePath, '', 'utf8');
        console.log('Logs cleared successfully.');
    } catch (error) {
        console.error('Error clearing logs:', error);
    }
}