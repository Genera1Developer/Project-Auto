import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');
const encryptionKey = process.env.LOG_ENCRYPTION_KEY || 'default_encryption_key'; // Store securely!
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}


export function logRequest(req, res, url) {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${url} - ${res.statusCode} - ${req.ip || req.socket?.remoteAddress}\n`;
    const encryptedLogMessage = encrypt(logMessage);

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
                return decryptedLog !== null ? decryptedLog : "Decryption Failed";
            })
            .reverse();
    } catch (err) {
        console.error('Error reading log file:', err);
        return [];
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