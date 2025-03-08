document.addEventListener('DOMContentLoaded', function() {
  const urlForm = document.getElementById('urlForm');
  const urlInput = document.getElementById('urlInput');
  const proxyUrl = '/uv/service/';

  urlForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let url = urlInput.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const encodedUrl = encodeURIComponent(url);
    window.location.href = proxyUrl + encodedUrl;
  });
});

edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
}

.container {
    text-align: center;
    z-index: 1;
}

h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 0 0 10px #00bcd4;
}

form {
    display: inline-block;
}

input[type="text"] {
    padding: 10px;
    font-size: 1.2em;
    border: 2px solid #00bcd4;
    background-color: #333;
    color: #fff;
    border-radius: 5px;
    margin-right: 10px;
}

button {
    padding: 10px 20px;
    font-size: 1.2em;
    background-color: #00bcd4;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #008ba7;
}

footer {
    position: fixed;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #777;
    z-index: 1;
}

a {
    color: #00bcd4;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

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
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <form id="urlForm">
            <input type="text" id="urlInput" placeholder="Enter URL">
            <button type="submit">Go</button>
        </form>
    </div>
    <footer>
        <p>&copy; 2024 Encrypted Proxy | <a href="#">Learn More</a></p>
    </footer>
    <script src="public/script.js"></script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
          console.log('callback - particles.js config loaded');
        });
    </script>
</body>
</html>

edit filepath: particles.json
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
}