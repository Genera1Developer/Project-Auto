document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('proxy-form');
  const urlInput = document.getElementById('url');
  const iframe = document.getElementById('proxy-iframe');

  /* global particlesJS */
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#2ecc71' // Encryption-themed color: Emerald green
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
          src: '',
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
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
        color: '#3498db', // Encryption-themed color: Bright blue
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 4,
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
          distance: 200,
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
      background_color: '#2c3e50', // Darker background
      background_image: '',
      background_position: '50% 50%',
      background_repeat: 'no-repeat',
      background_size: 'cover'
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let url = urlInput.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url; // Default to http if no protocol specified
    }

    iframe.src = '/api/proxy?url=' + encodeURIComponent(url);
  });

  // Add event listener for iframe load to handle potential errors
  iframe.addEventListener('load', () => {
    // Check if the iframe content is an error page
    if (iframe.contentDocument && iframe.contentDocument.body) {
      const bodyContent = iframe.contentDocument.body.textContent;
      if (bodyContent.includes('Proxy Error') || bodyContent.includes('error')) {
        alert('An error occurred while loading the page. Please check the URL and try again.');
      }
    }
  });

  // Function to handle iframe errors
  iframe.addEventListener('error', () => {
    alert('Failed to load the content in the iframe. Please check the URL.');
  });
});