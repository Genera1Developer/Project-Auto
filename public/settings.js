function loadSettings() {
    try {
        const settingsJSON = localStorage.getItem('proxySettings');
        if (settingsJSON) {
            try {
                const settings = JSON.parse(settingsJSON);
                document.getElementById('proxyHost').value = settings.proxyHost || 'localhost';
                document.getElementById('proxyPort').value = settings.proxyPort || '8080';
                document.getElementById('encryptionType').value = settings.encryptionType || 'none';
                document.getElementById('certificatePath').value = settings.certificatePath || '';
                document.getElementById('customEncryptionAlgo').value = settings.customEncryptionAlgo || '';

                // Trigger the change event to update the disabled state of input fields
                const encryptionTypeSelect = document.getElementById('encryptionType');
                encryptionTypeSelect.dispatchEvent(new Event('change'));
            } catch (jsonError) {
                console.error("Error parsing settings JSON:", jsonError);
                alert("Failed to parse settings. Using default values.");
                // Optionally, clear the invalid settings from localStorage
                localStorage.removeItem('proxySettings');
                // Reset fields to default
                document.getElementById('proxyHost').value = 'localhost';
                document.getElementById('proxyPort').value = '8080';
                document.getElementById('encryptionType').value = 'none';
                document.getElementById('certificatePath').value = '';
                document.getElementById('customEncryptionAlgo').value = '';
                const encryptionTypeSelect = document.getElementById('encryptionType');
                encryptionTypeSelect.dispatchEvent(new Event('change'));

            }
        }
    } catch (error) {
        console.error("Error loading settings from localStorage:", error);
        alert("Failed to load settings. Please check the console for details.");
    }
}

// Call loadSettings when the page loads
window.onload = loadSettings;