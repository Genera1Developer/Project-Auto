document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uv-form');
    const address = document.getElementById('uv-address');
    const error = document.getElementById('uv-error');
    const encodedUrl = document.getElementById('encodedUrl');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            const url = address.value.trim();
            if (!url) {
                throw new Error('Please enter a URL.');
            }

            const encoded = Ultraviolet.codec.xor.encode(url);
            encodedUrl.textContent = encoded;
            let urlToLoad = __uv$config.prefix + encoded;

            // Open in new tab/window
            window.open(urlToLoad, '_blank');

            error.textContent = ''; // Clear any previous errors
        } catch (e) {
            error.textContent = e.message;
            console.error(e);
        }
    });

    // Dark mode toggle (basic implementation)
    const darkModeButton = document.getElementById('dark-mode-toggle');

    darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // You might want to save the user's preference in localStorage
    });

    // Particles.js initialization (assuming it's in public/particles.json)
    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('particles.json loaded...');
    });
});