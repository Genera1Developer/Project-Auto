const particlesConfig = {
  "particles": {
    "number": {
      "value": 150,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#2ecc71" // Encryption green
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#2ecc71"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.7,
        "opacity_min": 0.3,
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
      "color": "#2ecc71",
      "opacity": 0.5,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 4,
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
};

window.onload = function() {
  particlesJS('particles-js', particlesConfig);

  // Optional: Add a rotating encryption key icon
  const keyIcon = document.createElement('div');
  keyIcon.innerHTML = '<i class="fas fa-key fa-spin" style="font-size:3em; color:#2ecc71;"></i>'; //Encryption Green
  keyIcon.style.position = 'fixed';
  keyIcon.style.bottom = '20px';
  keyIcon.style.right = '20px';
  keyIcon.style.zIndex = '1000'; // Ensure it's on top
  document.body.appendChild(keyIcon);

  // Add a subtle encryption message ticker
  const ticker = document.createElement('div');
  ticker.id = 'encryption-ticker';
  ticker.style.position = 'fixed';
  ticker.style.bottom = '0';
  ticker.style.left = '0';
  ticker.style.width = '100%';
  ticker.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  ticker.style.color = '#2ecc71'; // Encryption green
  ticker.style.padding = '5px';
  ticker.style.textAlign = 'center';
  ticker.style.overflow = 'hidden';
  ticker.innerHTML = 'Securing your connection with advanced encryption...';
  document.body.appendChild(ticker);
};