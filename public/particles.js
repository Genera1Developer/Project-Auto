particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#007bff"
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
      "color": "#007bff",
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
});
edit filepath: public/style.css
content: /* Dark theme with encryption-related styling */
body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #000; /* Deep black background */
    color: #00ff00; /* Green text for matrix-like effect */
    overflow: hidden; /* Hide scrollbars */
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    position: relative;
    z-index: 1; /* Ensure content is above particles */
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #00ff00; /* Green text */
    text-shadow: 0 0 5px #00ff00; /* Glowing effect */
}

input[type="url"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #00ff00; /* Green border */
    background-color: #111; /* Dark input background */
    color: #00ff00; /* Green text */
    border-radius: 5px;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    background-color: #00ff00; /* Green button */
    color: #000; /* Black text */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #00b300; /* Darker green on hover */
}

/* Particles.js styles */
#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0; /* Behind the content */
}

/* Add a subtle "encrypted" text effect */
.encrypted-text {
    position: relative;
}

.encrypted-text::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #00ff00;
    overflow: hidden;
    animation: glitch 2s linear infinite;
}

@keyframes glitch {
    0% {
        clip: rect(auto, auto, auto, auto);
    }
    10%, 30%, 50%, 70%, 90% {
        clip: rect(0, 999px, 0, 0);
    }
    20%, 40%, 60%, 80%, 100% {
        clip: rect(auto, auto, auto, auto);
    }
}

edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1 class="encrypted-text" data-text="Encrypted Web Proxy">Encrypted Web Proxy</h1>
        <form id="url-form">
            <input type="url" id="url-input" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>