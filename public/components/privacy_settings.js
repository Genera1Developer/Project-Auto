document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('privacySettingsButton');
    const settingsPanel = document.getElementById('privacySettingsPanel');
    const closeButton = document.getElementById('closePrivacySettings');

    if (settingsButton && settingsPanel && closeButton) {
        settingsButton.addEventListener('click', function() {
            settingsPanel.style.display = 'block';
        });

        closeButton.addEventListener('click', function() {
            settingsPanel.style.display = 'none';
        });

        // Optional: Close the panel if the user clicks outside of it
        window.addEventListener('click', function(event) {
            if (event.target == settingsPanel) {
                settingsPanel.style.display = 'none';
            }
        });
    } else {
        console.error('One or more elements not found.');
    }
});