function loadSettings() {
    try {
        const settingsJSON = localStorage.getItem('proxySettings');
        if (settingsJSON) {
            const settings = JSON.parse(settingsJSON);
            document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
            document.getElementById('proxyPort').value = settings.proxyPort || '8080';
            document.getElementById('encryptionType').value = settings.encryptionType || 'none';
            document.getElementById('certificatePath').value = settings.certificatePath || '';
            document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';

            // Trigger the change event to update the disabled state of the input fields
            const encryptionTypeSelect = document.getElementById('encryptionType');
            encryptionTypeSelect.dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error("Error loading settings:", error);
        // Handle error appropriately, e.g., display an error message to the user
    }
}

// Call loadSettings when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);

edit filepath: api/encryption.js
content: 
const crypto = require('crypto');

// AES Encryption Function
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES Decryption Function
function decrypt(text, key) {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}

module.exports = {
  encrypt,
  decrypt
};