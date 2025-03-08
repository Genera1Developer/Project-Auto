const form = document.getElementById('uv-form');
const input = document.getElementById('uv-address');
const button = document.getElementById('uv-search');

const address = document.getElementById('address');
const error = document.getElementById('error');
const errorCode = document.getElementById('errorCode');

// Example URL that will be proxied.
const exUrl = 'https://example.com';

form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    error.textContent = 'Failed to register service worker.';
    errorCode.textContent = err;
    throw err;
  }

  let url = input.value.trim();
  if (!url) url = exUrl;
  else if (!isUrl(url)) {
    error.textContent = 'Please enter a valid URL.';
    errorCode.textContent = 'Invalid URL.';
    return;
  }

  localStorage.setItem('encodedURL', __uv$config.encodeUrl(url));
  window.location.href = '/uv/service/';
});

async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    error.textContent = 'Service workers are not supported.';
    errorCode.textContent = 'Service workers not supported.';
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/uv/uv.sw.js', {
      scope: '/uv/service/',
    });
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }
  } catch (err) {
    console.error(`Registration failed with ${err}`);
    error.textContent = 'Service worker registration failed.';
    errorCode.textContent = err;
    throw err;
  }
}

function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="public/index.css">
    <link rel="icon" type="image/png" href="public/favicon.png">
    <link rel="manifest" href="public/manifest.json">
    <meta name="description" content="Securely browse the web with our encrypted proxy. Protect your privacy and access blocked content.">
    <meta name="keywords" content="proxy, web proxy, encrypted, security, privacy, browse, unblock, censorship">
    <meta name="author" content="Proxy Dev">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <p>Enter the URL to browse securely:</p>
        <form id="uv-form">
            <input type="text" id="uv-address" placeholder="https://example.com">
            <button id="uv-search">Go</button>
        </form>
        <div id="error" class="error"></div>
        <pre><code id="errorCode" class="error-code"></code></pre>
        <p class="notice">Your connection is encrypted for enhanced security.</p>
    </div>
    <script src="public/particles.min.js"></script>
    <script src="public/particles-config.js"></script>
    <script src="public/script.js"></script>
</body>
</html>
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    overflow: hidden; /* Prevent scrollbars */
}

.container {
    width: 80%;
    max-width: 600px;
    margin: 100px auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    text-align: center;
    position: relative;
    z-index: 1;
}

h1 {
    color: #00ff00;
    margin-bottom: 20px;
}

p {
    margin-bottom: 15px;
}

input[type="text"] {
    width: 70%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #00ff00;
    background-color: #333;
    color: #fff;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #00ff00;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #00cc00;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
}

.notice {
    font-size: 0.8em;
    color: #aaa;
}

.error {
    color: #ff0000;
    margin-top: 10px;
}

.error-code {
    background-color: #222;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    white-space: pre-wrap;
}
edit filepath: public/particles-config.js
content: particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#00ff00"
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
      "random": false,
      "anim": {
        "enable": false,
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
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#00ff00",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
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
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 0.8,
        "speed": 3
      },
      "repulse": {
        "distance": 200
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true,
  "config_demo": {
    "hide_card": false,
    "background_color": "#b61924",
    "background_image": "",
    "background_position": "50% 50%",
    "background_repeat": "no-repeat",
    "background_size": "cover"
  }
});