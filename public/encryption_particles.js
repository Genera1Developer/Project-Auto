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
          dataFields: ['particles.color.value', 'particles.line_linked.color']
      },
      customEncrypt: async function(data, key, iv, algorithm) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return data;
            }

            const encryptValue = async (text, secretKey, iv) => {
              try {
                const enc = new TextEncoder();

                const keyBytes = enc.encode(secretKey);
                const ivBytes = enc.encode(iv);

                const keyMaterial = await crypto.subtle.importKey(
                  "raw",
                  keyBytes,
                  { name: "AES-CBC", length: 256 },
                  false,
                  ["encrypt", "decrypt"]
                );

                const encryptedData = await crypto.subtle.encrypt(
                  { name: "AES-CBC", iv: ivBytes, },
                  keyMaterial,
                  enc.encode(text)
                );

                const encryptedArray = new Uint8Array(encryptedData);
                const encryptedString = btoa(String.fromCharCode(...encryptedArray));
                return encryptedString;

              } catch (error) {
                console.error("Encryption failed:", error);
                return text;
              }
            };

            if (Array.isArray(data)) {
                const encryptedArray = [];
                for (const item of data) {
                    if (typeof item === 'string') {
                        encryptedArray.push(await encryptValue(item, key, iv));
                    } else {
                        encryptedArray.push(item);
                    }
                }
                return encryptedArray;
            } else if (typeof data === 'string'){
                return await encryptValue(data, key, iv);
            } else {
                return data;
            }
        },
        decrypt: async function(encryptedData, key, iv, algorithm) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return encryptedData;
            }

            const decryptValue = async (encryptedBase64, secretKey, iv) => {
              try {
                const enc = new TextEncoder();
                const keyBytes = enc.encode(secretKey);
                const ivBytes = enc.encode(iv);
                const keyMaterial = await crypto.subtle.importKey(
                  "raw",
                  keyBytes,
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
                  { name: "AES-CBC", iv: ivBytes },
                  keyMaterial,
                  encryptedArray
                );

                const dec = new TextDecoder();
                return dec.decode(decryptedData);

              } catch (error) {
                console.error("Decryption failed:", error);
                return encryptedBase64;
              }
            };

            if (Array.isArray(encryptedData)) {
                const decryptedArray = [];
                for (const item of encryptedData) {
                    if (typeof item === 'string') {
                      decryptedArray.push(await decryptValue(item, key, iv));
                    } else {
                      decryptedArray.push(item);
                    }
                }
                return decryptedArray;
            } else if (typeof encryptedData === 'string'){
                return await decryptValue(encryptedData, key, iv);
            } else {
                return encryptedData;
            }
        }
  },
  "fn": {
    "update": async function() {
        const pJS = this;
        if (pJS.plugins.encrypt.enable) {
            const config = pJS.actualOptions;
            const encryptPlugin = pJS.plugins;

            if (config && config.plugins && config.plugins.encrypt && config.plugins.encrypt.dataFields) {
                const { dataFields } = config.plugins.encrypt;
                const { key, iv } = config.encrypt_config;
                const algorithm = "AES-CBC";

                for (const fieldPath of dataFields) {
                    let target = config;
                    const pathParts = fieldPath.split('.');
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        if(!target || typeof target !== 'object') break;
                        target = target[pathParts[i]];
                    }
                    if(!target) continue;

                    const lastPart = pathParts[pathParts.length - 1];

                    if (target && target.hasOwnProperty(lastPart)) {
                      try{
                        const originalValue = target[lastPart];
                        if (Array.isArray(originalValue)) {
                          const encryptedArray = await Promise.all(originalValue.map(async item => {
                            if (typeof item === 'string') {
                              return await encryptPlugin.customEncrypt(item, key, iv, algorithm)
                            } else {
                              return item;
                            }
                          }));
                          target[lastPart] = encryptedArray;

                        } else if(typeof originalValue === 'string'){
                          target[lastPart] = await encryptPlugin.customEncrypt(originalValue, key, iv, algorithm);
                        }
                      } catch (error) {
                        console.error("Encryption update failed:", error);
                      }

                    }
                }

            }
        }
    },
    "draw": async function() {
        const pJS = this;
        if (pJS.plugins.encrypt.enable) {
            const config = pJS.actualOptions;
            const encryptPlugin = pJS.plugins;

            if (config && config.plugins && config.plugins.encrypt && config.plugins.encrypt.dataFields) {
                const { dataFields } = config.plugins.encrypt;
                const { key, iv } = config.encrypt_config;
                const algorithm = "AES-CBC";

                for (const fieldPath of dataFields) {
                    let target = config;
                    const pathParts = fieldPath.split('.');
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        if(!target || typeof target !== 'object') break;
                        target = target[pathParts[i]];
                    }
                     if(!target) continue;
                    const lastPart = pathParts[pathParts.length - 1];

                    if (target && target.hasOwnProperty(lastPart)) {
                      try{
                        const encryptedValue = target[lastPart];
                        if (Array.isArray(encryptedValue)) {
                          const decryptedArray = await Promise.all(encryptedValue.map(async item => {
                            if (typeof item === 'string') {
                              return await encryptPlugin.decrypt(item, key, iv, algorithm);
                            } else {
                              return item;
                            }
                          }));
                          target[lastPart] = decryptedArray;
                        } else if(typeof encryptedValue === 'string'){
                            target[lastPart] = await encryptPlugin.decrypt(encryptedValue, key, iv, algorithm);
                        }
                      } catch (error) {
                          console.error("Decryption draw failed:", error);
                      }
                    }
                }
            }
        }
    }
}
});