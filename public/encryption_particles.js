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
      value: '#00FF00'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 1,
        color: '#008000'
      },
      polygon: {
        nb_sides: 6 // Changed to 6 for a more "key" like feel
      }
    },
    opacity: {
      value: 0.7,
      random: true,
      anim: {
        enable: true,
        speed: 1.5, // Slightly faster opacity animation
        opacity_min: 0.3,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 14, // Slightly faster size animation
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 160,
      color: '#00FF00',
      opacity: 0.6, // Increased opacity for stronger links
      width: 1
    },
    move: {
      enable: true,
      speed: 2.5, // Slightly faster movement
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
        distance: 150, //Adjusted grab distance
        line_linked: {
          opacity: 0.8 //Adjusted grab opacity
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