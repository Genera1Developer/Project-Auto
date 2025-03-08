document.addEventListener('DOMContentLoaded', function() {
    particlesJS.load('particles-js', 'particles.json', function() {
      console.log('callback - particles.js config loaded');
    });

    const form = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const proxyUrl = '/proxy/'; // Replace with your proxy endpoint

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let url = urlInput.value;

        // Simple URL validation
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url; // Default to http if no protocol specified
        }

        // Removed proxyUrl construction, handled by Ultraviolet
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
});
edit filepath: public/index.css
content: body {
    margin: 0;
    font-family: sans-serif;
    background-color: #111;
    color: #eee;
    overflow: hidden; /* Hide scrollbars */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
    color: #00bcd4;
}

form {
    display: flex;
    width: 80%;
    max-width: 600px;
}

input[type="url"] {
    flex-grow: 1;
    padding: 0.75em;
    border: none;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-color: #222;
    color: #fff;
}

button[type="submit"] {
    padding: 0.75em 1.5em;
    border: none;
    border-radius: 0.25em;
    background-color: #00bcd4;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #0097a7;
}

/* Add a subtle glow effect */
h1, button[type="submit"] {
    text-shadow: 0 0 5px rgba(0, 188, 212, 0.7);
}

/* Improved input focus style */
input[type="url"]:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 188, 212, 0.5);
}

#disclaimer {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: 0.7em;
    color: #777;
}
edit filepath: public/particles.json
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
      "value": "#00bcd4"
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
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 5,
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
      "color": "#00bcd4",
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
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
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
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Secure Access</h1>
        <form id="urlForm">
            <input type="url" id="url" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
        <p id="disclaimer">Use at your own risk.</p>
    </div>

    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>