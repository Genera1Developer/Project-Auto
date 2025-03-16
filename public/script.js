document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const proxyButton = document.getElementById('proxyButton');
    const resultsDiv = document.getElementById('results');

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const targetUrl = urlInput.value;

        if (!targetUrl) {
            resultsDiv.textContent = 'Please enter a URL.';
            return;
        }

        proxyButton.disabled = true;
        proxyButton.textContent = 'Proxying...';
        resultsDiv.textContent = '';

        // Using fetch API for modern browsers
        fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // Get the encrypted text
            })
            .then(encryptedData => {
                // Display the encrypted data (for debugging). In a real scenario, decrypt on the client-side
                resultsDiv.textContent = 'Encrypted Response: ' + encryptedData;
            })
            .catch(error => {
                console.error('Fetch error:', error);
                resultsDiv.textContent = 'Error: ' + error.message;
            })
            .finally(() => {
                proxyButton.disabled = false;
                proxyButton.textContent = 'Proxy!';
            });
    });
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="public/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>
<body>
    <div id="particles-js"></div>
    <header>
        <h1><i class="fas fa-lock"></i> Encrypted Web Proxy</h1>
    </header>
    <main>
        <section id="input-section">
            <form id="urlForm">
                <label for="url">Enter URL:</label>
                <input type="url" id="url" name="url" placeholder="https://example.com" required>
                <button type="submit" id="proxyButton">Proxy!</button>
            </form>
        </section>
        <section id="results-section">
            <h2>Result:</h2>
            <div id="results"></div>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Encrypted Proxy. Secure browsing guaranteed.</p>
    </footer>

    <script src="public/particles.js"></script>
    <script>
        particlesJS.load('particles-js', 'public/particles.json', function() {
            console.log('callback - particles.js config loaded');
        });
    </script>
    <script src="public/script.js"></script>
</body>
</html>
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000; /* Dark background for encryption theme */
    color: #fff;
    line-height: 1.6;
    overflow: hidden; /* Hide scrollbars */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    top: 0;
    left: 0;
}

header, main, footer {
    padding: 20px;
    text-align: center;
}

header {
    background-color: rgba(0, 102, 204, 0.3); /* Encryption blue */
    border-bottom: 1px solid #222;
}

header h1 {
    margin: 0;
    font-size: 2em;
    font-weight: bold;
    color: #fff;
}

main {
    padding-top: 40px;
}

#input-section {
    margin-bottom: 30px;
}

#urlForm {
    display: flex;
    flex-direction: column;
    align-items: center;
}

label {
    margin-bottom: 10px;
    font-size: 1.2em;
}

input[type="url"] {
    padding: 10px;
    width: 80%;
    max-width: 400px;
    margin-bottom: 20px;
    border: 1px solid #444;
    background-color: #222;
    color: #fff;
    border-radius: 5px;
}

button {
    padding: 12px 24px;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #004488;
}

#results-section {
    margin-top: 30px;
}

#results {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 5px;
    overflow-wrap: break-word;
    max-width: 80%;
    margin: 0 auto;
}

footer {
    background-color: rgba(0, 102, 204, 0.3); /* Encryption blue */
    border-top: 1px solid #222;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}

/* Font Awesome Icon Styling */
.fas {
    margin-right: 5px; /* Space between icon and text */
    color: #fff;
}