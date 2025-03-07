document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('privacySettingsButton');
    const settingsPanel = document.getElementById('privacySettingsPanel');
    const closeButton = document.getElementById('closePrivacySettings');

    if (!settingsButton || !settingsPanel || !closeButton) {
        console.error('One or more privacy settings elements not found.');
        return;
    }

    settingsButton.addEventListener('click', function() {
        settingsPanel.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });

    settingsPanel.addEventListener('click', function(event) {
        if (event.target === settingsPanel) {
            settingsPanel.style.display = 'none';
        }
    });
});