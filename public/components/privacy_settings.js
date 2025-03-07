document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('privacySettingsButton');
    const settingsPanel = document.getElementById('privacySettingsPanel');
    const closeButton = document.getElementById('closePrivacySettings');

    if (!settingsButton || !settingsPanel || !closeButton) {
        console.error('One or more privacy settings elements not found.');
        return;
    }

    settingsButton.addEventListener('click', function() {
        settingsPanel.style.display = 'flex';
    });

    closeButton.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });

    settingsPanel.addEventListener('click', function(event) {
        if (event.target === settingsPanel) {
            settingsPanel.style.display = 'none';
        }
    });

    // Accessibility: Close panel on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && settingsPanel.style.display === 'flex') {
            settingsPanel.style.display = 'none';
        }
    });
});