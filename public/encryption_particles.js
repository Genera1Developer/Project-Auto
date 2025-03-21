particlesJS('particles-js', {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: ['#00FF00', '#0F0', '#7CFC00', '#ADFF2F', '#32CD32']
    },
    shape: {
      type: 'polygon',
      stroke: {
        width: 1,
        color: '#006400'
      },
      polygon: {
        nb_sides: 6 // Hexagon for encryption key feel
      },
      image: {
        src: '',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 1.8,
        opacity_min: 0.2,
        sync: false
      }
    },
    size: {
      value: 2.5,
      random: true,
      anim: {
        enable: true,
        speed: 2.5,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#00C853',
      opacity: 0.5,
      width: 1.2
    },
    move: {
      enable: true,
      speed: 1.7,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
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
        distance: 170,
        line_linked: {
          opacity: 0.8
        }
      },
      bubble: {
        distance: 220,
        size: 0,
        duration: 2,
        opacity: 0,
        speed: 3
      },
      repulse: {
        distance: 250,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 3
      }
    }
  },
  retina_detect: true
});