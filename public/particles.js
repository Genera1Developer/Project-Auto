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
      "value": "#00c698"
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
      "color": "#00c698",
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
edit filepath: public/index.css
content: body {
    margin: 0;
    font-family: 'Roboto Mono', monospace;
    background-color: #000;
    color: #fff;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 20px rgba(0, 200, 150, 0.8);
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #00c698;
    text-shadow: 0 0 10px #00c698;
}

input[type="url"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #00c698;
    background-color: #111;
    color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    transition: border-color 0.3s ease;
}

input[type="url"]:focus {
    border-color: #00ffc8;
    outline: none;
}

button {
    padding: 10px 20px;
    background-color: #00c698;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #00ffc8;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="index.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap" rel="stylesheet">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <form id="url-form">
            <input type="url" id="url-input" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>