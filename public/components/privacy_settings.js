document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('privacySettingsButton');
    const settingsPanel = document.getElementById('privacySettingsPanel');
    const closeButton = document.getElementById('closePrivacySettings');

    if (!settingsButton || !settingsPanel || !closeButton) {
        console.error('One or more privacy settings elements not found.');
        return;
    }

    settingsButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button behavior
        settingsPanel.style.display = 'flex';
        settingsPanel.focus(); // Set focus for accessibility
    });

    closeButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button behavior
        settingsPanel.style.display = 'none';
        settingsButton.focus(); // Return focus to the settings button
    });

    settingsPanel.addEventListener('click', function(event) {
        if (event.target === settingsPanel) {
            settingsPanel.style.display = 'none';
            settingsButton.focus(); // Return focus to the settings button
        }
    });

    // Accessibility: Close panel on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && settingsPanel.style.display === 'flex') {
            settingsPanel.style.display = 'none';
            settingsButton.focus(); // Return focus to the settings button
        }
    });
});