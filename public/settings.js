function loadSettings() {
    try {
        const settingsJSON = localStorage.getItem('proxySettings');
        let settings = settingsJSON ? JSON.parse(settingsJSON) : {};

        // Default values
        const defaultSettings = {
            proxyHost: 'localhost',
            proxyPort: '8080',
            encryptionType: 'none',
            certificatePath: '',
            customEncryptionAlgo: ''
        };

        // Merge stored settings with defaults
        settings = { ...defaultSettings, ...settings };

        // Sanitize and validate proxyHost
        settings.proxyHost = String(settings.proxyHost).trim();

        // Validate proxyPort (must be a number within a valid range)
        const port = parseInt(settings.proxyPort, 10);
        settings.proxyPort = (Number.isInteger(port) && port > 0 && port <= 65535) ? port.toString() : defaultSettings.proxyPort;

        // Validate encryptionType (only allow predefined values)
        const allowedEncryptionTypes = ['none', 'tls', 'custom'];
        settings.encryptionType = allowedEncryptionTypes.includes(settings.encryptionType) ? settings.encryptionType : defaultSettings.encryptionType;

        // Sanitize certificatePath
        settings.certificatePath = String(settings.certificatePath).trim();

        // Sanitize customEncryptionAlgo
        settings.customEncryptionAlgo = String(settings.customEncryptionAlgo).trim();

        document.getElementById('proxyHost').value = settings.proxyHost;
        document.getElementById('proxyPort').value = settings.proxyPort;
        document.getElementById('encryptionType').value = settings.encryptionType;
        document.getElementById('certificatePath').value = settings.certificatePath;
        document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo;

        // Trigger the change event to update disabled states
        const encryptionTypeSelect = document.getElementById('encryptionType');
        encryptionTypeSelect.dispatchEvent(new Event('change'));


    } catch (error) {
        console.error('Error loading settings:', error);
        alert('Error loading settings. Please check your browser console for details.');
        // Optionally, reset settings to default values here
        resetSettingsToDefault(); // Call reset function if parsing fails.
    }
}

function resetSettingsToDefault() {
    const defaultSettings = {
        proxyHost: 'localhost',
        proxyPort: '8080',
        encryptionType: 'none',
        certificatePath: '',
        customEncryptionAlgo: ''
    };

    document.getElementById('proxyHost').value = defaultSettings.proxyHost;
    document.getElementById('proxyPort').value = defaultSettings.proxyPort;
    document.getElementById('encryptionType').value = defaultSettings.encryptionType;
    document.getElementById('certificatePath').value = defaultSettings.certificatePath;
    document.getElementById('customEncryptionAlgo').value = defaultSettings.customEncryptionAlgo;

    // Trigger the change event to update disabled states
    const encryptionTypeSelect = document.getElementById('encryptionType');
    encryptionTypeSelect.dispatchEvent(new Event('change'));

    localStorage.setItem('proxySettings', JSON.stringify(defaultSettings));

}

// Call loadSettings when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);
content: [brief description of edits]