const form = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const encodedUrl = document.getElementById('encodedUrl');
const proxyUrl = '/service/'; // Proxy URL prefix
const particleContainer = document.getElementById('particle-container');

// Function to generate particles
function generateParticles(numParticles) {
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position within the container
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        // Random size
        const size = Math.random() * 5 + 2; // Size between 2px and 7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random animation duration (speed)
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`; // Duration between 2s and 5s

        particleContainer.appendChild(particle);
    }
}

// Call the function to generate particles (adjust the number as needed)
generateParticles(50);


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = urlInput.value;

    // Check if the URL is empty
    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    try {
        // Encode the URL using the Ultraviolet codec
        const encodedURL = __uv$config.encodeUrl(url);
        const proxyURL = proxyUrl + encodedURL;
        encodedUrl.value = proxyURL; // Display the proxified URL in the text box
        window.location.href = proxyURL; // Redirect the page to the proxified URL
    } catch (error) {
        console.error('Encoding error:', error);
        alert('An error occurred while encoding the URL. Please check the URL and try again.');
    }
});

// Copy to Clipboard function
const copyButton = document.getElementById('copyButton');

copyButton.addEventListener('click', () => {
    encodedUrl.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = 'Copy URL';
    }, 2000);
});
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000; /* Dark background */
    color: #ddd; /* Light text color */
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Align items to the top */
    height: 100vh;
    overflow: hidden; /* Hide scrollbars */
}

#particle-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Make sure particles don't interfere with click events */
}

.particle {
    position: absolute;
    background-color: #00ffff; /* Cyan */
    border-radius: 50%;
    opacity: 0.7;
    animation: float 5s linear infinite;
}

@keyframes float {
    0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0.7;
    }
    50% {
        transform: translateY(20px) translateX(10px) rotate(180deg);
        opacity: 0.3;
    }
    100% {
        transform: translateY(0) translateX(0) rotate(360deg);
        opacity: 0.7;
    }
}

h1 {
    color: #00ffff; /* Cyan */
    margin-top: 20px;
    text-shadow: 0 0 10px #00ffff; /* Glowing effect */
}

form {
    background-color: rgba(30, 30, 30, 0.8);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    width: 80%;
    max-width: 500px;
    margin-top: 30px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
}

input[type="url"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
}

button {
    background-color: #00ffff; /* Cyan */
    color: #000;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #00bbbb;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #222;
    color: #fff;
}

#copyButton {
    background-color: #00ffff;
    color: #000;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
}

#copyButton:hover {
    background-color: #00bbbb;
}

/* Add more styles as needed */
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="public/index.css">
</head>
<body>
    <div id="particle-container"></div>
    <h1>Encrypted Web Proxy</h1>
    <form id="urlForm">
        <label for="urlInput">Enter URL:</label>
        <input type="url" id="urlInput" placeholder="https://example.com">
        <button type="submit">Go</button>
    </form>
    <label for="encodedUrl">Proxified URL:</label>
    <input type="text" id="encodedUrl" readonly>
    <button id="copyButton">Copy URL</button>
    <script src="uv/uv.bundle.js"></script>
    <script src="uv/uv.config.js"></script>
    <script src="public/script.js"></script>
</body>
</html>