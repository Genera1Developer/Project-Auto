document.addEventListener('DOMContentLoaded', function() {
    // Function to generate a random hexadecimal color
    function getRandomHexColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Function to create a single glowing particle
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = Math.random() * 10 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = getRandomHexColor();
        particle.style.boxShadow = `0 0 5px ${particle.style.backgroundColor}, 0 0 10px ${particle.style.backgroundColor}`;
        particle.style.animationDuration = Math.random() * 3 + 2 + 's'; // Slightly faster animation
        particle.style.animationDelay = Math.random() * -5 + 's';
        document.body.appendChild(particle);

        // Remove the particle after it's done animating
        particle.addEventListener('animationend', function() {
            particle.remove();
        });
    }

    // Create a lot of particles!
    for (let i = 0; i < 50; i++) { // Increased for more density
        createParticle();
    }

    // Generate new particles periodically to keep it lively
    setInterval(createParticle, 250);

    // Proxy form functionality (existing code, adjusted for better security)
    const form = document.getElementById('proxy-form');
    const urlInput = document.getElementById('url-input');
    const goButton = document.getElementById('go-button');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a URL.');
            return;
        }

        // URL validation and sanitization (basic example)
        try {
            new URL(url); // Will throw an error if not a valid URL
        } catch (e) {
            url = 'https://' + url; // Attempt to prepend https:// if it's missing
            try {
                new URL(url); // Check again
            } catch (e) {
                alert('Invalid URL. Please enter a valid URL (e.g., https://example.com).');
                return;
            }
        }


        // Encode the URL using Ultraviolet's encoding function (assumes it's available)
        const encodedUrl = self.__uv$config.encodeUrl(url);

        // Redirect to the proxy service with the encoded URL
        window.location.href = self.__uv$config.prefix + encodedUrl;

    });


    // Theme Toggle (Simple light/dark mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode'); // More descriptive class name
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Light Mode'; // Update button text
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    });
});
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #111; /* Dark background */
    color: #eee; /* Light text */
    overflow: hidden; /* Hide scrollbars caused by particles */
    transition: background-color 0.3s, color 0.3s; /* Smooth transition for theme changes */
}

body.dark-mode {
    background-color: #eee;
    color: #111;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: relative; /* For positioning particles */
    z-index: 1; /* Ensure content is above particles */
}

h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px #000000; /* Adding a text shadow for better readability */
}

form {
    display: flex;
    gap: 10px;
}

input[type="url"] {
    padding: 10px;
    border: 2px solid #333; /* Darker border for better contrast */
    border-radius: 5px;
    background-color: #222; /* Slightly lighter background */
    color: #eee;
    width: 300px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff; /* A more vibrant blue */
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

/* Glowing Particle Styles */
.particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none; /* Make sure particles don't interfere with clicks */
    z-index: -1; /* Place particles behind content */
    animation: float 5s linear infinite;
}

@keyframes float {
    0% {
        transform: translateY(0);
        opacity: 0.8;
    }
    50% {
        transform: translateY(-20px);
        opacity: 0.4;
    }
    100% {
        transform: translateY(0);
        opacity: 0.8;
    }
}

#theme-toggle {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 2; /* Ensure it's above particles and container */
}

#theme-toggle:hover {
    background-color: #666;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="public/index.css">
    <link rel="icon" href="data:,">
</head>
<body>
    <button id="theme-toggle">Dark Mode</button>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <form id="proxy-form">
            <input type="url" id="url-input" placeholder="Enter URL" required>
            <button type="submit" id="go-button">Go</button>
        </form>
    </div>
    <script src="public/script.js"></script>
</body>
</html>