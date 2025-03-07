document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('privacySettingsButton');
    const settingsPanel = document.getElementById('privacySettingsPanel');
    const closeButton = document.getElementById('closePrivacySettings');

    if (!settingsButton || !settingsPanel || !closeButton) {
        console.error('One or more privacy settings elements not found.');
        return;
    }

    const openSettings = () => {
        settingsPanel.style.display = 'flex';
        settingsPanel.setAttribute('aria-hidden', 'false');
        settingsButton.setAttribute('aria-expanded', 'true');
        settingsPanel.focus();
    };

    const closeSettings = () => {
        settingsPanel.style.display = 'none';
        settingsPanel.setAttribute('aria-hidden', 'true');
        settingsButton.setAttribute('aria-expanded', 'false');
        settingsButton.focus();
    };

    settingsButton.addEventListener('click', function(event) {
        event.preventDefault();
        openSettings();
    });

    closeButton.addEventListener('click', function(event) {
        event.preventDefault();
        closeSettings();
    });

    settingsPanel.addEventListener('click', function(event) {
        if (event.target === settingsPanel) {
            closeSettings();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && settingsPanel.style.display === 'flex') {
            closeSettings();
        }
    });
});