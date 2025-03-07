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
        console.error('Error loading settings:', error);
        alert('Failed to load settings. Please check console for details.');
    }
}

// Call loadSettings when the page loads
window.onload = loadSettings;