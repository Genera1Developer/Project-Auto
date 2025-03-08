document.addEventListener('DOMContentLoaded', function() {
    const encryptionTypeSelect = document.getElementById('encryptionType');
    const certificatePathInput = document.getElementById('certificatePath');
    const customEncryptionAlgoInput = document.getElementById('customEncryptionAlgo');

    function updateEncryptionFields() {
        const encryptionType = encryptionTypeSelect.value;
        certificatePathInput.disabled = (encryptionType !== 'ssl');
        customEncryptionAlgoInput.disabled = (encryptionType !== 'custom');
    }

    encryptionTypeSelect.addEventListener('change', updateEncryptionFields);

    // Load settings from localStorage on page load
    const savedSettings = localStorage.getItem('proxySettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
        document.getElementById('proxyPort').value = settings.proxyPort || '8080';
        encryptionTypeSelect.value = settings.encryptionType || 'none';
        certificatePathInput.value = settings.certificatePath || '';
        customEncryptionAlgoInput.value = settings.customEncryptionAlgo || '';
        updateEncryptionFields(); // Ensure correct fields are enabled/disabled
    }
});

function saveSettings() {
    const proxyHost = document.getElementById('proxyHost').value;
    const proxyPort = document.getElementById('proxyPort').value;
    const encryptionType = document.getElementById('encryptionType').value;
    const certificatePath = document.getElementById('certificatePath').value;
    const customEncryptionAlgo = document.getElementById('customEncryptionAlgo').value;

    // Clear all error messages
    document.getElementById('generalError').textContent = '';
    document.getElementById('certificatePathError').textContent = '';
    document.getElementById('customEncryptionAlgoError').textContent = '';

    let hasErrors = false;

    // Basic validation (can be improved)
    if (!proxyHost || !proxyPort) {
        document.getElementById('generalError').textContent = 'Proxy Host and Port are required.';
        hasErrors = true;
    }

    if (encryptionType === 'ssl' && !certificatePath) {
        document.getElementById('certificatePathError').textContent = 'Certificate path is required for SSL/TLS encryption.';
        hasErrors = true;
    }

    if (encryptionType === 'custom' && !customEncryptionAlgo) {
        document.getElementById('customEncryptionAlgoError').textContent = 'Custom encryption algorithm is required.';
        hasErrors = true;
    }

    if (hasErrors) {
        return; // Stop saving if there are errors
    }

    const settings = {
        proxyHost: proxyHost,
        proxyPort: proxyPort,
        encryptionType: encryptionType,
        certificatePath: certificatePath,
        customEncryptionAlgo: customEncryptionAlgo
    };

    // Convert settings to JSON
    const settingsJSON = JSON.stringify(settings);

    // Store the settings (e.g., localStorage, cookies, or send to server)
    localStorage.setItem('proxySettings', settingsJSON);

    alert('Settings saved!');

    // Send settings to the background script/server (implement as needed)
    // Example using a custom event:
    window.dispatchEvent(new CustomEvent('proxySettingsSaved', { detail: settings }));
}

edit filepath: api/config.js
content: 
module.exports = {
  defaultProxyPort: 8080,
  defaultEncryptionType: 'none',
  availableEncryptionTypes: ['none', 'ssl', 'aes256'],
  certificatePath: '/path/to/default/cert.pem',
  privateKeyPath: '/path/to/default/key.pem',
  aesEncryptionKey: 'YourAES256EncryptionKey', // Store securely!
  logDirectory: 'logs',
};