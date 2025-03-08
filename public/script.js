const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchEngine = document.getElementById('search-engine');
const goButton = document.getElementById('go-button');
const error = document.getElementById('uv-error');
const encodedUrl = document.getElementById('encodedUrl');

const particlesConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#007bff' // Encryption-themed color
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
      value: 0.7,
      random: true,
      anim: {
        enable: true,
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
      color: '#007bff', // Encryption-themed color
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
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
  retina_detect: true
};

particlesJS('particles-js', particlesConfig);

form.addEventListener('submit', async event => {
    event.preventDefault();
    go();
});

goButton.addEventListener('click', async event => {
    go();
});

async function go() {
    let url = address.value.trim();
    if (!url)
        return;

    error.textContent = '';

    if (searchEngine.value !== 'default' && !url.includes('.')) {
        url = searchEngine.value + url;
    } else if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url;
    }

    try {
        const encodedURL = Ultraviolet.codec.xor.encode(url);
        encodedUrl.textContent = encodedURL;
        window.location.href = __uv$config.prefix + encodedURL;
    } catch (e) {
        error.textContent = e.message;
        console.error(e);
    }
}