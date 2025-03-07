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
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error("Encryption error:", error);
        return "Encryption Failed";
    }

}

function decrypt(text) {
    if (!encryptionKey) {
        return text; // Return original text if key is missing.
    }

    try {
        const textParts = text.split(':');
        if (textParts.length !== 3) {
            console.error("Invalid log format: Incorrect number of parts.");
            return "Decryption Failed: Invalid Log Format";
        }
        const iv = Buffer.from(textParts[0], 'hex');
        const authTag = Buffer.from(textParts[1], 'hex');
        const encryptedText = Buffer.from(textParts[2], 'hex');

        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return "Decryption Failed";
    }
}


export function logRequest(req, res, url) {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    const logMessage = `${new Date().toISOString()} - ${req.method} ${url} - ${res.statusCode} - ${ip}\n`;
    const encryptedLogMessage = encrypt(logMessage);

    if (typeof encryptedLogMessage === 'string' && encryptedLogMessage.startsWith("Encryption Failed")) {
        console.error("Failed to encrypt log message. Skipping log entry.");
        return;
    }

    fs.appendFile(logFilePath, encryptedLogMessage, err => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const logs = fs.readFileSync(logFilePath, 'utf8');
        return logs.split('\n')
            .filter(log => log.trim() !== '')
            .map(log => {
                const decryptedLog = decrypt(log);
                if (typeof decryptedLog === 'string' && decryptedLog.startsWith("Decryption Failed")) {
                    return "Decryption Failed: Log entry may be corrupted or the encryption key is incorrect.";
                }
                return decryptedLog;
            })
            .reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return ["Error reading log file."];
    }
}

export function clearLogs() {
  try {
    fs.writeFileSync(logFilePath, '', 'utf8');
    console.log('Logs cleared successfully.');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
}