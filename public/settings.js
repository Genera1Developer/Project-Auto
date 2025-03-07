function loadSettings() {
    let settings = localStorage.getItem('proxySettings');
    if (settings) {
        try {
            settings = JSON.parse(settings);
            document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
            document.getElementById('proxyPort').value = settings.proxyPort || '8080';
            document.getElementById('encryptionType').value = settings.encryptionType || 'none';

            // Trigger change event to update disabled state of certificate and algo fields
            let encryptionTypeSelect = document.getElementById('encryptionType');
            encryptionTypeSelect.dispatchEvent(new Event('change'));

            document.getElementById('certificatePath').value = settings.certificatePath || '';
            document.getElementById('aesKey').value = settings.aesKey || '';
            document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
        } catch (e) {
            console.error("Error parsing settings from localStorage:", e);
            localStorage.removeItem('proxySettings');
            alert("Error loading settings. Settings have been reset.");
        }
    }
}

// Load settings when the page loads
window.addEventListener('load', loadSettings);

edit filepath: api/security.js
content: 
const crypto = require('crypto');

// Function to generate a secure random key
function generateSecureKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES
function encryptAES(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data using AES
function decryptAES(data, key) {
    const textParts = data.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    generateSecureKey,
    encryptAES,
    decryptAES
};