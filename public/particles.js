/* particlesJS('dom-id', params);
*/

particlesJS('particles-js', {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#00c698'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#00c698',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true,
  config_demo: {
    hide_card: false,
    background_color: '#b61924',
    background_image: '',
    opacity: 0.5,
    particles_js: {
      particles: {
        number: {
          value: 400
        }
      },
      interactivity: {
        events: {
          onhover: {
            enable: true
          }
        }
      }
    }
  }
});
edit filepath: public/index.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000; /* Dark background for encryption theme */
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #00c698; /* Neon green text */
}

.container {
    background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black container */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 204, 152, 0.5); /* Neon glow effect */
    text-align: center;
    width: 80%;
    max-width: 600px;
    border: 1px solid #00c698; /* Neon green border */
}

h1 {
    color: #00c698;
    text-shadow: 0 0 10px rgba(0, 204, 152, 0.8); /* Stronger neon glow */
}

#urlInput {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #00c698;
    border-radius: 4px;
    background-color: #111; /* Dark input background */
    color: #00c698;
}

#urlInput:focus {
    outline: none;
    border-color: #00ffcc; /* Brighter green on focus */
    box-shadow: 0 0 5px #00ffcc;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #00c698;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

#proxyButton:hover {
    background-color: #00ffcc;
    color: black;
}

#content {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #00c698;
    padding: 10px;
    border-radius: 4px;
    background-color: #111;
    color: #00c698;
    overflow-wrap: break-word;
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

/* Particles.js container */
#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1; /* Behind all content */
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Go</button>
        <div id="content"></div>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>