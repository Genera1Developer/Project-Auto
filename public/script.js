document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const goButton = document.getElementById('go');
    const encodedUrlDisplay = document.getElementById('encodedUrl');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let url = urlInput.value.trim();

        if (url) {
            // Basic URL validation (you can enhance this)
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url; // Default to HTTPS
                urlInput.value = url; // Update the input field
            }
            
            // Encode the URL using xor
            const encodedURL = __uv$config.encodeUrl(url);

            // Update the location with the encoded URL
            window.location.href = __uv$config.prefix + encodedURL;
        }
    });

        // Particles.js initialization (assuming particles.json exists and is configured)
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('Particles.js loaded...');
        });

    // Encryption theme tweaks (example)
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#0f0'; // Green text for "encryption" feel
});