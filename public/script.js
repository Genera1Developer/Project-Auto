document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(url));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            contentDiv.textContent = data;
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'Error fetching content. Please check the URL and try again.';
        }
    });

    // Encryption Strength Meter (Placeholder)
    const encryptionStrength = 'High'; // Replace with actual calculation later
    const encryptionStrengthDiv = document.createElement('div');
    encryptionStrengthDiv.id = 'encryptionStrength';
    encryptionStrengthDiv.textContent = `Encryption Strength: ${encryptionStrength}`;
    contentDiv.parentNode.insertBefore(encryptionStrengthDiv, contentDiv);

    // Secure Connection Indicator (Placeholder)
    const secureConnection = true; // Replace with actual check later
    const secureConnectionDiv = document.createElement('div');
    secureConnectionDiv.id = 'secureConnection';
    secureConnectionDiv.textContent = secureConnection ? 'Secure Connection: Enabled' : 'Secure Connection: Disabled';
    contentDiv.parentNode.insertBefore(secureConnectionDiv, contentDiv);
});