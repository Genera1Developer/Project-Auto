import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/proxy.log');

export function logRequest(req, res, url) {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${url} - ${res.statusCode} - ${req.ip || req.socket?.remoteAddress}\n`;
    fs.appendFile(logFilePath, logMessage, err => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

export function getLogs() {
    try {
        const logs = fs.readFileSync(logFilePath, 'utf8');
        return logs.split('\n').filter(log => log.trim() !== '').reverse();
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