document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const outputDiv = document.getElementById('output');
    const errorDiv = document.getElementById('error');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;
        if (!url) {
            errorDiv.textContent = 'Please enter a URL.';
            outputDiv.textContent = '';
            return;
        }

        errorDiv.textContent = ''; // Clear previous errors
        outputDiv.textContent = 'Encrypting and fetching...';

        try {
            // Simulate encryption before sending to proxy
            const { encryptedURL, encryptionKey } = await encryptURL(url);

            // Call the proxy endpoint (replace with your actual proxy endpoint)
            const response = await fetch(`/api/proxy?url=${encryptedURL}&key=${encryptionKey}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Assuming the proxy returns decrypted content
            const data = await response.text();
            outputDiv.textContent = data; // Display the response in a basic way

             // Store the key locally for possible later decryption (INSECURE for production, for demo only)
             localStorage.setItem('lastEncryptionKey', encryptionKey);

        } catch (error) {
            console.error('Error fetching from proxy:', error);
            outputDiv.textContent = '';
            errorDiv.textContent = `Error: ${error.message}`;
        }
    });

    // AES encryption function
    async function encryptURL(url) {
        const key = CryptoJS.lib.WordArray.random(16); // 128-bit key
        const iv = CryptoJS.lib.WordArray.random(16); // Initialization vector

        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(url),
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        const encryptedURL = encodeURIComponent(encrypted.toString());
        const encryptionKey = encodeURIComponent(CryptoJS.enc.Base64.stringify(key));

        console.log('Encrypted URL:', encryptedURL);
        console.log('Encryption Key:', encryptionKey);

        return { encryptedURL, encryptionKey };
    }

    // Load particles.js
    particlesJS.load('particles-js', '/particlesjs-config.json', function() {
        console.log('particles.js loaded - encryption theme');
    });
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="url" id="urlInput" placeholder="Enter URL to access securely">
        <button id="proxyButton">Go via Proxy</button>
        <div id="output" class="output-area"></div>
        <div id="error" class="error-area"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    overflow: hidden; /* Prevent scrollbars */
    background-color: #000; /* Dark background for encryption theme */
    color: #0f0; /* Green text as a nod to old encryption displays */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #000; /* Match body background */
}

.container {
    width: 80%;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); /* Glowing shadow */
}

h1 {
    color: #0f0;
    margin-bottom: 20px;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.8); /* Glowing text */
}

input[type="url"] {
    width: 70%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #0f0;
    border-radius: 5px;
    background-color: #111;
    color: #0f0;
}

button {
    padding: 10px 20px;
    background-color: #0f0;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0b0;
}

.output-area {
    margin-top: 20px;
    padding: 15px;
    border: 1px dashed #0f0;
    border-radius: 5px;
    color: #0f0;
    min-height: 50px;
    white-space: pre-wrap; /* Preserves formatting */
}

.error-area {
    margin-top: 10px;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid red;
    border-radius: 5px;
    color: red;
}
edit filepath: public/particlesjs-config.json
content: {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#0f0"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 4,
        "size_min": 0.3,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#0f0",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 600
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 250,
        "size": 0,
        "duration": 2,
        "opacity": 0,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}