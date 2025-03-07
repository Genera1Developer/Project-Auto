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

            // Trigger the change event to update disabled states
            const encryptionTypeSelect = document.getElementById('encryptionType');
            encryptionTypeSelect.dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Handle error appropriately, e.g., display a message to the user
    }
}

// Call loadSettings when the page loads
window.addEventListener('DOMContentLoaded', loadSettings);