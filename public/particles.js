/* particlesJS v2.0.0 by Vincent Garreau - vincentgarreau.com - MIT license */


// particlesJS('dom-id', {
//   particles: {
//     color: '#fff',
//     shape: 'circle',
//     opacity: 1,
//     size: 2.5,
//     size_random: true,
//     nb: 200,
//     line_linked: {
//       enable: true,
//       distance: 100,
//       color: '#fff',
//       opacity: 0.4,
//       width: 1
//     },
//     move: {
//       enable: true,
//       speed: 2,
//       direction: 'none',
//       random: true,
//       straight: false,
//       out_mode: 'out',
//       bounce: false,
//       attract: {
//         enable: false,
//         rotateX: 3000,
//         rotateY: 3000
//       }
//     }
//   },
//   interactivity: {
//     detect_on: 'canvas',
//     events: {
//       onhover: {
//         enable: false,
//         mode: 'grab'
//       },
//       onclick: {
//         enable: false,
//         mode: 'push'
//       },
//       resize: true
//     },
//     modes: {
//       grab: {
//         distance: 150,
//         line_linked: {
//           opacity: 1
//         }
//       },
//       push: {
//         particles_nb: 4
//       },
//       remove: {
//         particles_nb: 2
//       }
//     }
//   },
//   retina_detect: true,
//   config_demo: {
//     hide_card: false,
//     background_color: '#1b162d',
//     background_image: '',
//     background_position: '50% 50%',
//     background_repeat: 'no-repeat',
//     background_size: 'cover'
//   }
// }

// );

/* particlesJS.load alternative method */
window.onload = function() {
  particlesJS.load('particles-js', 'particles.json', function() {
    console.log('callback - particles.js config loaded');
  });
};
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
      "value": "#00FFFF"
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
      "color": "#00FFFF",
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
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Go</button>
        <div id="content"></div>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>

</body>
</html>
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000; /* Dark background */
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #fff; /* Light text */
    overflow: hidden; /* Hide scrollbars caused by particles */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0; /* Place behind content */
}

.container {
    background-color: rgba(30, 30, 30, 0.8); /* Dark translucent container */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 200, 200, 0.3); /* Cyan glow */
    text-align: center;
    width: 80%;
    max-width: 600px;
    z-index: 1; /* Place above particles */
}

h1 {
    color: #00FFFF; /* Cyan title */
}

#urlInput {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #00FFFF; /* Cyan border */
    border-radius: 4px;
    background-color: #222; /* Dark input background */
    color: #fff;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #00FFFF; /* Cyan button */
    color: #000; /* Black text */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#proxyButton:hover {
    background-color: #00BFFF; /* Slightly darker cyan on hover */
}

#content {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #00FFFF; /* Cyan border */
    padding: 10px;
    border-radius: 4px;
    background-color: #333; /* Dark content background */
}

/* Error message styling */
#content p.error {
    color: #FF4136; /* Red error text */
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        width: 95%;
    }

    #urlInput {
        width: calc(100% - 10px);
    }
}
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "http": "0.0.1-security",
    "url": "^0.11.0",
    "particlesjs": "^2.2.3"
  },
  "devDependencies": {},
  "keywords": [
    "proxy",
    "web"
  ],
  "author": "Your Name",
  "license": "MIT"
}