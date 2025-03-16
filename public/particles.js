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
        "distance": 200,
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
});
edit filepath: public/style.css
content: body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #000;
    color: #fff;
    overflow: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #007bff;
    text-shadow: 0 0 10px #007bff;
}

input[type="url"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #007bff;
    background-color: #111;
    color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

input[type="url"]:focus {
    outline: none;
    box-shadow: 0 0 10px #007bff;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #0056b3;
    box-shadow: 0 0 10px #007bff;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

/* New styles for encryption theme */
.encryption-text {
    font-family: 'Courier New', monospace;
    font-size: 1.2em;
    color: #00ff00;
    text-shadow: 0 0 5px #00ff00;
}

.security-icon {
    font-size: 3em;
    color: #ff0;
    margin-bottom: 10px;
}

edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <i class="security-icon"></i>
        <h1>Encrypted Web Proxy</h1>
        <p class="encryption-text">Enter the URL to browse securely:</p>
        <form id="url-form">
            <input type="url" id="url-input" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>