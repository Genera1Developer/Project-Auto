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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                contentDiv.textContent = JSON.stringify(data, null, 2);
            } else {
                const text = await response.text();

                 // Simple encryption/decryption example (ROT13)
                let encrypted = '';
                for (let i = 0; i < text.length; i++) {
                    let char = text[i];
                    if (char.match(/[a-z]/i)) {
                        const code = text.charCodeAt(i);
                        let shift;

                        if ((code >= 65) && (code <= 90)) {
                            shift = ((code - 65 + 13) % 26) + 65;
                        } else if ((code >= 97) && (code <= 122)) {
                            shift = ((code - 97 + 13) % 26) + 97;
                        } else {
                            shift = code; //non-alphabetic
                        }
                        char = String.fromCharCode(shift);

                    }
                     encrypted += char;
                }
                contentDiv.textContent = encrypted;
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            contentDiv.textContent = 'Error fetching content. Check the console for details.';
            contentDiv.classList.add('error');
        }
    });
});