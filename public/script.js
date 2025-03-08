document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uv-form');
    const address = document.getElementById('uv-address');
    const go = document.getElementById('uv-go');
    const error = document.getElementById('uv-error');
    const encodedPrefix = btoa('Ultraviolet');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            let url = address.value.trim();
            if (!url) {
                throw new Error('Please enter a URL.');
            }

            if (!url.startsWith('https://') && !url.startsWith('http://')) {
                url = 'https://' + url;
            }

            const encodedURL = btoa(url);
            const proxyURL = '/uv/service/' + encodedPrefix + '/' + encodedURL;

            window.location.href = proxyURL;
        } catch (e) {
            error.textContent = e.message;
            error.classList.remove('d-none');
        }
    });
});

edit filepath: public/index.css
content: body {
    background-color: #000;
    color: #0F0;
    font-family: monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
}

#container {
    text-align: center;
    padding: 20px;
    border: 2px solid #0F0;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.8);
}

h1 {
    font-size: 2em;
    margin-bottom: 20px;
    text-shadow: 0 0 10px #0F0;
}

input[type="text"] {
    background-color: #333;
    color: #0F0;
    border: 1px solid #0F0;
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 1em;
}

button {
    background-color: #0F0;
    color: #000;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-family: monospace;
    font-size: 1em;
}

button:hover {
    background-color: #0A0;
}

#uv-error {
    color: red;
    margin-top: 10px;
}

.d-none {
    display: none;
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
    <title>Encrypted Web Access</title>
    <link rel="stylesheet" href="public/index.css">
</head>
<body>
    <div id="particles-js"></div>
    <div id="container">
        <h1>Secure Web Proxy</h1>
        <form id="uv-form">
            <input type="text" id="uv-address" placeholder="Enter URL">
            <button type="submit" id="uv-go">Go</button>
        </form>
        <div id="uv-error" class="d-none"></div>
    </div>
    <script src="public/particles.min.js"></script>
    <script src="public/particles.js"></script>
    <script src="public/script.js"></script>
</body>
</html>

edit filepath: public/particles.js
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
        "speed": 40,
        "size_min": 0.1,
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
      "speed": 3,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
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
var count_particles, stats, update;
stats = new Stats;
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
count_particles = document.querySelector('.js-count-particles');
update = function() {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);
;