particlesJS('particles-js', {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 700
      }
    },
    color: {
      value: '#00FF00' // Encryption Green
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#008000'
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: '',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.6,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 2.5,
      random: true,
      anim: {
        enable: true,
        speed: 8,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#00C000',
      opacity: 0.5,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
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
        distance: 140,
        line_linked: {
          opacity: 0.7
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
        particles_nb: 3
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