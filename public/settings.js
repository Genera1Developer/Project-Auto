document.addEventListener('DOMContentLoaded', function() {
    loadSettings();

    document.getElementById('encryptionType').addEventListener('change', function() {
        var encryptionType = this.value;
        document.getElementById('certificatePath').disabled = (encryptionType !== 'ssl');
        document.getElementById('customEncryptionAlgo').disabled = (encryptionType !== 'custom');
        document.getElementById('aesKey').disabled = (encryptionType !== 'aes');

        document.getElementById('certificatePathError').textContent = '';
        document.getElementById('customEncryptionAlgoError').textContent = '';
        document.getElementById('aesKeyError').textContent = '';
    });
});

function saveSettings() {
    var proxyHost = document.getElementById('proxyHost').value;
    var proxyPort = document.getElementById('proxyPort').value;
    var encryptionType = document.getElementById('encryptionType').value;
    var certificatePath = document.getElementById('certificatePath').value;
    var customEncryptionAlgo = document.getElementById('customEncryptionAlgo').value;
    var aesKey = document.getElementById('aesKey').value;

    document.getElementById('generalError').textContent = '';
    document.getElementById('certificatePathError').textContent = '';
    document.getElementById('customEncryptionAlgoError').textContent = '';
    document.getElementById('aesKeyError').textContent = '';

    let hasErrors = false;

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

    if (encryptionType === 'aes' && !aesKey) {
        document.getElementById('aesKeyError').textContent = 'AES Key is required for AES encryption.';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    if (encryptionType === 'aes' && aesKey.length !== 32) {
        document.getElementById('aesKeyError').textContent = 'AES Key must be 32 characters long (256-bit).';
         hasErrors = true;
         return;
    }


    var settings = {
        proxyHost: proxyHost,
        proxyPort: proxyPort,
        encryptionType: encryptionType,
        certificatePath: certificatePath,
        customEncryptionAlgo: customEncryptionAlgo,
        aesKey: aesKey
    };

    var settingsJSON = JSON.stringify(settings);

    localStorage.setItem('proxySettings', settingsJSON);

    alert('Settings saved!');

     // Store AES key securely if AES encryption is enabled
     if (encryptionType === 'aes') {
        storeAesKeySecurely(aesKey);
    }
}

function loadSettings() {
    var settingsJSON = localStorage.getItem('proxySettings');
    if (settingsJSON) {
        var settings = JSON.parse(settingsJSON);
        document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
        document.getElementById('proxyPort').value = settings.proxyPort || '8080';
        document.getElementById('encryptionType').value = settings.encryptionType || 'none';

        var encryptionTypeSelect = document.getElementById('encryptionType');
        encryptionTypeSelect.dispatchEvent(new Event('change'));

        document.getElementById('certificatePath').value = settings.certificatePath || '';
        document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';
        document.getElementById('aesKey').value = settings.aesKey || ''; // Load the AES key
    }
}

function storeAesKeySecurely(aesKey) {
    // In a real application, you would use a more secure method to store the AES key, such as:
    // 1. Encrypting the key using a user-specific key derived from their password.
    // 2. Using a secure enclave or hardware security module (HSM).
    // 3. Storing the key on a secure server and retrieving it when needed.

    // For demonstration purposes, we'll just store it in localStorage, but this is NOT secure.
    localStorage.setItem('aesKey', aesKey);

    console.warn('AES key stored insecurely in localStorage. This is for demonstration purposes only.');
}