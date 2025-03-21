particlesJS('particles-js', {
  particles: {
    number: {
      value: 250,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: ['#00FF00', '#0F0', '#00FA9A', '#00CED1'] // More greens and teal
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 1,
        color: '#003300' // Darker green stroke
      },
      polygon: {
        nb_sides: 5 // Pentagon - a slightly different shape
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
        speed: 1, // Increased speed
        opacity_min: 0.2, // Slightly higher min opacity
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true, // Enable size animation
        speed: 3,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 160,
      color: '#009900',
      opacity: 0.6,
      width: 1.5
    },
    move: {
      enable: true,
      speed: 2.5, // Slightly increased speed
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
        distance: 200,
        line_linked: {
          opacity: 0.9
        }
      },
      bubble: {
        distance: 250,
        size: 0,
        duration: 2,
        opacity: 0,
        speed: 3
      },
      repulse: {
        distance: 280,
        duration: 0.4
      },
      push: {
        particles_nb: 5
      },
      remove: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
});