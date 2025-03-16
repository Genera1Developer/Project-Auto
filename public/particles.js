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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #121212;
    color: #fff;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    text-align: center;
    padding: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 80%;
    max-width: 600px;
}

h1 {
    font-size: 2.8em;
    margin-bottom: 25px;
    color: #00c698;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

input[type="url"] {
    padding: 12px 15px;
    width: calc(100% - 30px);
    border: none;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    border-radius: 7px;
    margin-bottom: 30px;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

input[type="url"]:focus {
    background-color: rgba(0, 0, 0, 0.5);
    outline: none;
    box-shadow: 0 0 8px rgba(0, 198, 152, 0.5);
}

button {
    padding: 12px 25px;
    background-color: #00c698;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    background-color: #009673;
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

/* Optional: Add a subtle animation */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.container {
    animation: fadeIn 0.5s ease-in-out;
}

edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const encodedPrefix = '/service/';

    form.addEventListener('submit', async event => {
        event.preventDefault();
        let url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a URL.');
            return;
        }

        try {
            // URL validation regex (more comprehensive)
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            if (!urlRegex.test(url)) {
                alert('Please enter a valid URL (including http:// or https://).');
                return;
            }

            const encodedURL = encodeURIComponent(url);
            window.location.href = encodedPrefix + encodedURL;
        } catch (error) {
            console.error('Error encoding URL:', error);
            alert('An error occurred while encoding the URL.');
        }
    });
});