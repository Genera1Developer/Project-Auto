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
      value: ['#00FF00', '#0F0', '#7CFC00', '#ADFF2F', '#32CD32', '#00BCD4', '#FFEB3B']
    },
    shape: {
      type: 'polygon',
      stroke: {
        width: 1,
        color: '#006400'
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
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        opacity_min: 0.2,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 3,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 160,
      color: '#00C853',
      opacity: 0.6,
      width: 1.3
    },
    move: {
      enable: true,
      speed: 2,
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
        distance: 180,
        line_linked: {
          opacity: 0.9
        }
      },
      bubble: {
        distance: 230,
        size: 0,
        duration: 2,
        opacity: 0,
        speed: 3
      },
      repulse: {
        distance: 260,
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
  retina_detect: true,
  encrypt_config: {
        algorithm: 'AES-256-CBC',
        key: 'YOUR_SECURE_KEY',
        iv: 'YOUR_IV_KEY'
    },
  plugins: {
      encrypt: {
          enable: false,
          dataFields: ['particles.color.value', 'particles.line_linked.color'],
          algorithm: 'encrypt_config.algorithm',
          key: 'encrypt_config.key',
          iv: 'encrypt_config.iv'
      },
      customEncrypt: function(data, key, iv, algorithm) {
            // Placeholder for encryption logic
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return data;
            }

            // Example Encryption function (replace with actual crypto calls)
            const encryptValue = async (text, secretKey, iv) => {
              try {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey(
                  "raw",
                  enc.encode(secretKey),
                  { name: "AES-CBC", length: 256 },
                  false,
                  ["encrypt", "decrypt"]
                );

                const encryptedData = await crypto.subtle.encrypt(
                  { name: "AES-CBC", iv: enc.encode(iv) },
                  key,
                  enc.encode(text)
                );

                const encryptedArray = new Uint8Array(encryptedData);
                const encryptedString = String.fromCharCode(...encryptedArray);
                return btoa(encryptedString);

              } catch (error) {
                console.error("Encryption failed:", error);
                return text;
              }
            };

            if (Array.isArray(data)) {
                return Promise.all(data.map(item => encryptValue(item, key, iv)));
            } else {
                return encryptValue(data, key, iv);
            }
        },
        decrypt: function(encryptedData, key, iv, algorithm) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return encryptedData;
            }

            const decryptValue = async (encryptedBase64, secretKey, iv) => {
              try {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey(
                  "raw",
                  enc.encode(secretKey),
                  { name: "AES-CBC", length: 256 },
                  false,
                  ["encrypt", "decrypt"]
                );

                const encryptedString = atob(encryptedBase64);
                const encryptedArray = new Uint8Array(encryptedString.length);
                for (let i = 0; i < encryptedString.length; i++) {
                  encryptedArray[i] = encryptedString.charCodeAt(i);
                }

                const decryptedData = await crypto.subtle.decrypt(
                  { name: "AES-CBC", iv: enc.encode(iv) },
                  key,
                  encryptedArray
                );

                const dec = new TextDecoder();
                return dec.decode(decryptedData);

              } catch (error) {
                console.error("Decryption failed:", error);
                return encryptedBase64; // Return original if decryption fails
              }
            };

            if (Array.isArray(encryptedData)) {
                return Promise.all(encryptedData.map(item => decryptValue(item, key, iv)));
            } else {
                return decryptValue(encryptedData, key, iv);
            }
        }
  },
  "fn": {
    "update": function() {
        if (this.plugins.encrypt.enable) {
            const config = this.actualOptions;
            const encryptPlugin = this.plugins;

            if (config && config.plugins && config.plugins.encrypt && config.plugins.encrypt.dataFields) {
                const dataFields = config.plugins.encrypt.dataFields;
                const key = config.encrypt_config.key;
                const iv = config.encrypt_config.iv;
                const algorithm = config.encrypt_config.algorithm;

                dataFields.forEach(fieldPath => {
                    let target = config;
                    const pathParts = fieldPath.split('.');
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        target = target[pathParts[i]];
                        if (!target) return;
                    }
                    const lastPart = pathParts[pathParts.length - 1];

                    if (target[lastPart]) {
                      const originalValue = target[lastPart];
                      encryptPlugin.customEncrypt(originalValue, key, iv, algorithm).then(encryptedValue => {
                            target[lastPart] = encryptedValue;
                        });
                    }
                });
            }
        }
    }
}
});