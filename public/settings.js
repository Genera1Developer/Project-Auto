document.addEventListener('DOMContentLoaded', function() {
    const encryptionTypeSelect = document.getElementById('encryptionType');
    const certificatePathInput = document.getElementById('certificatePath');
    const customEncryptionAlgoInput = document.getElementById('customEncryptionAlgo');

    function updateInputStates() {
        const encryptionType = encryptionTypeSelect.value;
        certificatePathInput.disabled = (encryptionType !== 'ssl');
        customEncryptionAlgoInput.disabled = (encryptionType !== 'custom');
    }

    encryptionTypeSelect.addEventListener('change', updateInputStates);

    // Load saved settings on page load
    loadSettings();

    function loadSettings() {
        const savedSettings = localStorage.getItem('proxySettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
            document.getElementById('proxyPort').value = settings.proxyPort || '8080';
            encryptionTypeSelect.value = settings.encryptionType || 'none';
            certificatePathInput.value = settings.certificatePath || '';
            customEncryptionAlgoInput.value = settings.customEncryptionAlgo || '';
            updateInputStates(); // Ensure correct input states after loading
        }
    }

    window.saveSettings = function() {
        const proxyHost = document.getElementById('proxyHost').value;
        const proxyPort = document.getElementById('proxyPort').value;
        const encryptionType = encryptionTypeSelect.value;
        const certificatePath = certificatePathInput.value;
        const customEncryptionAlgo = customEncryptionAlgoInput.value;

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
    };
});