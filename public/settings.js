function loadSettings() {
    try {
        const settingsJSON = localStorage.getItem('proxySettings');
        if (settingsJSON) {
            let settings = JSON.parse(settingsJSON);

            // Sanitize and validate proxyHost
            settings.proxyHost = settings.proxyHost ? String(settings.proxyHost).trim() : 'localhost';

            // Validate proxyPort (must be a number within a valid range)
            const port = parseInt(settings.proxyPort, 10);
            settings.proxyPort = (Number.isInteger(port) && port > 0 && port <= 65535) ? port.toString() : '8080';

            // Validate encryptionType (only allow predefined values)
            const allowedEncryptionTypes = ['none', 'tls', 'custom'];
            settings.encryptionType = allowedEncryptionTypes.includes(settings.encryptionType) ? settings.encryptionType : 'none';

            // Sanitize certificatePath
            settings.certificatePath = settings.certificatePath ? String(settings.certificatePath).trim() : '';

            // Sanitize customEncryptionAlgo
            settings.customEncryptionAlgo = settings.customEncryptionAlgo ? String(settings.customEncryptionAlgo).trim() : '';

            document.getElementById('proxyHost').value = settings.proxyHost;
            document.getElementById('proxyPort').value = settings.proxyPort;
            document.getElementById('encryptionType').value = settings.encryptionType;
            document.getElementById('certificatePath').value = settings.certificatePath;
            document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo;

            // Trigger the change event to update disabled states
            const encryptionTypeSelect = document.getElementById('encryptionType');
            encryptionTypeSelect.dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        alert('Error loading settings. Please check your browser console for details.');
        // Optionally, reset settings to default values here
    }
}

// Call loadSettings when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);