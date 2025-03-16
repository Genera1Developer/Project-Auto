particlesJS('particles-js',

{
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#007bff"
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
      "color": "#007bff",
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
        "distance": 200
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true,
  "config_demo": {
    "hide_card": false,
    "background_color": "#b61924",
    "background_image": "",
    "background_position": "50% 50%",
    "background_repeat": "no-repeat",
    "background_size": "cover"
  }
}

);
edit filepath: api/encryption.js
content: class EncryptionHandler {
    constructor(key) {
        this.key = key;
    }

    async encryptData(data) {
        if (!data) {
            throw new Error('Data cannot be empty for encryption.');
        }

        const encoder = new TextEncoder();
        const dataArray = encoder.encode(JSON.stringify(data));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const algorithm = {
            name: 'AES-GCM',
            iv: iv
        };

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(this.key),
            algorithm,
            false,
            ['encrypt']
        );

        const encryptedData = await crypto.subtle.encrypt(algorithm, cryptoKey, dataArray);
        const encryptedDataArray = new Uint8Array(encryptedData);
        const combinedData = new Uint8Array(iv.length + encryptedDataArray.length);
        combinedData.set(iv, 0);
        combinedData.set(encryptedDataArray, iv.length);

        return btoa(String.fromCharCode(...combinedData));
    }

    async decryptData(encryptedBase64) {
        if (!encryptedBase64) {
            throw new Error('Encrypted data cannot be empty for decryption.');
        }

        const combinedData = new Uint8Array(
            [...atob(encryptedBase64)].map(char => char.charCodeAt(0))
        );
        const iv = combinedData.slice(0, 12);
        const encryptedDataArray = combinedData.slice(12);

        const algorithm = {
            name: 'AES-GCM',
            iv: iv
        };

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(this.key),
            algorithm,
            false,
            ['decrypt']
        );

        const decryptedData = await crypto.subtle.decrypt(algorithm, cryptoKey, encryptedDataArray);
        const decoder = new TextDecoder();
        const decryptedString = decoder.decode(decryptedData);

        return JSON.parse(decryptedString);
    }
}

module.exports = EncryptionHandler;