particlesJS('particles-js', {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#00FF00' // Encryption green
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 1,
        color: '#004000' // Darker encryption green
      },
      polygon: {
        nb_sides: 5 // Pentagon shape to suggest cryptography
      },
      image: {
        src: '',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.9,
      random: true,
      anim: {
        enable: true,
        speed: 1.5, //Slightly faster
        opacity_min: 0.4,
        sync: false
      }
    },
    size: {
      value: 2.5, //Slightly smaller
      random: true,
      anim: {
        enable: true,
        speed: 8, //Slightly slower
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150, //Slightly shorter
      color: '#00C000', //Bright green
      opacity: 0.7, //Slightly more opaque
      width: 1.5 //Slightly thinner
    },
    move: {
      enable: true,
      speed: 2.5, //Slightly faster
      direction: 'none',
      random: true,
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
        mode: 'grab'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140, //Slightly shorter
        line_linked: {
          opacity: 0.9 //More opaque
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 0.3,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 100,
        duration: 0.4
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
    background_color: '#000000',
    background_image: '',
    background_position: '50% 50%',
    background_repeat: 'no-repeat',
    background_size: 'cover'
  }
});