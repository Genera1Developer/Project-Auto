/* particlesJS('dom-id', params);
*/

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
      value: '#00FF00' // Encryption green
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 1,
        color: '#008000' // Darker green for stroke
      },
      polygon: {
        nb_sides: 5 // Pentagon - symbolic of security
      }
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 0.7,
        opacity_min: 0.4,
        sync: false
      }
    },
    size: {
      value: 2.5,
      random: true,
      anim: {
        enable: true,
        speed: 15,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#00FF00',
      opacity: 0.6,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
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
        mode: 'grab' // More interaction, like keys connecting
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 120,
        line_linked: {
          opacity: 0.8
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