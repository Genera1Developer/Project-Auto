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
edit filepath: api/proxy.js
content: const http = require('http');
const https = require('https');
const url = require('url');

const proxyHandler = (req, res) => {
    const targetURL = req.url.slice(1);

    if (!targetURL) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Please provide a URL to proxy.');
        return;
    }

    try {
        const parsedURL = new URL(targetURL);
        const options = {
            hostname: parsedURL.hostname,
            path: parsedURL.pathname + parsedURL.search,
            method: req.method,
            headers: req.headers
        };

        const proxyRequest = (parsedURL.protocol === 'https:' ? https : http).request(options, proxyResponse => {
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            proxyResponse.pipe(res, { end: true });
        });

        proxyRequest.on('error', error => {
            console.error('Proxy request error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy request failed.');
        });

        req.pipe(proxyRequest, { end: true });
    } catch (error) {
        console.error('URL parsing error:', error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid URL.');
    }
};

module.exports = proxyHandler;