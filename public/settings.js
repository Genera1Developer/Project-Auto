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
    } else {
        updateEncryptionFields(); // Ensure correct fields are enabled/disabled on initial load
    }
});

function saveSettings() {
    const proxyHost = document.getElementById('proxyHost').value;
    const proxyPort = document.getElementById('proxyPort').value;
    const encryptionType = document.getElementById('encryptionType').value;
    const certificatePath = document.getElementById('certificatePath').value;
    const customEncryptionAlgo = document.getElementById('customEncryptionAlgo').value;

    document.getElementById('generalError').textContent = '';
    document.getElementById('certificatePathError').textContent = '';
    document.getElementById('customEncryptionAlgoError').textContent = '';

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

    if (hasErrors) {
        return;
    }

    const settings = {
        proxyHost: proxyHost,
        proxyPort: proxyPort,
        encryptionType: encryptionType,
        certificatePath: certificatePath,
        customEncryptionAlgo: customEncryptionAlgo
    };

    try {
        const settingsJSON = JSON.stringify(settings);
        localStorage.setItem('proxySettings', settingsJSON);
        alert('Settings saved!');

         // Send settings to the server for processing (optional)
         sendSettingsToServer(settings);
    } catch (error) {
        document.getElementById('generalError').textContent = 'Error saving settings: ' + error.message;
    }
}

async function sendSettingsToServer(settings) {
    try {
        const response = await fetch('/api/security/settings', { // Assuming you have an endpoint to handle settings
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Settings sent to server:', result);
    } catch (error) {
        console.error('Error sending settings to server:', error);
        document.getElementById('generalError').textContent = 'Error communicating with the server.';
    }
}