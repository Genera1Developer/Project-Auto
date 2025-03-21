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
        iv: 'YOUR_IV_KEY',
        salt: 'YOUR_SALT'
    },
  plugins: {
      encrypt: {
          enable: false,
          dataFields: ['particles.color.value', 'particles.line_linked.color']
      },
      customEncrypt: async function(data, key, iv, algorithm, salt) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return data;
            }

            const encryptValue = async (text, secretKey, iv, salt) => {
              try {
                const enc = new TextEncoder();
                const keyBytes = this.stringToUint8Array(secretKey);
                const ivBytes = this.stringToUint8Array(iv);
                const saltBytes = this.stringToUint8Array(salt);

                const keyMaterial = await crypto.subtle.importKey(
                  "raw",
                  keyBytes,
                  { name: algorithm, length: 256 },
                  false,
                  ["encrypt", "decrypt"]
                );

                const combinedData = new Uint8Array([...saltBytes, ...enc.encode(text)]);

                const encryptedData = await crypto.subtle.encrypt(
                  { name: algorithm, iv: ivBytes },
                  keyMaterial,
                  combinedData
                );

                return this.arrayBufferToBase64(encryptedData);

              } catch (error) {
                console.error("Encryption failed:", error);
                return text;
              }
            };

            try {
              if (Array.isArray(data)) {
                  const encryptedArray = [];
                  for (const item of data) {
                      if (typeof item === 'string') {
                          encryptedArray.push(await encryptValue(item, key, iv, salt));
                      } else {
                          encryptedArray.push(item);
                      }
                  }
                  return encryptedArray;
              } else if (typeof data === 'string'){
                  return await encryptValue(data, key, iv, salt);
              } else {
                  return data;
              }
            } catch (error) {
                console.error("Encryption process failed:", error);
                return data;
            }
        },
        decrypt: async function(encryptedData, key, iv, algorithm, salt) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                return encryptedData;
            }

            const decryptValue = async (encryptedBase64, secretKey, iv, salt) => {
              try {

                const keyBytes = this.stringToUint8Array(secretKey);
                const ivBytes = this.stringToUint8Array(iv);
                const saltBytes = this.stringToUint8Array(salt);

                const keyMaterial = await crypto.subtle.importKey(
                  "raw",
                  keyBytes,
                  { name: algorithm, length: 256 },
                  false,
                  ["encrypt", "decrypt"]
                );

                const decryptedData = await crypto.subtle.decrypt(
                  { name: algorithm, iv: ivBytes },
                  keyMaterial,
                  this.base64ToArrayBuffer(encryptedBase64)
                );

                const saltLength = saltBytes.length;
                const originalData = decryptedData.slice(saltLength);

                const dec = new TextDecoder();
                return dec.decode(originalData);

              } catch (error) {
                console.error("Decryption failed:", error);
                return encryptedBase64;
              }
            };
            try {
                if (Array.isArray(encryptedData)) {
                    const decryptedArray = [];
                    for (const item of encryptedData) {
                        if (typeof item === 'string') {
                          try {
                            decryptedArray.push(await decryptValue(item, key, iv, salt));
                          } catch (err) {
                            console.warn("Decryption issue", err);
                            decryptedArray.push(item);
                          }
                        } else {
                          decryptedArray.push(item);
                        }
                    }
                    return decryptedArray;
                } else if (typeof encryptedData === 'string'){
                    try{
                      return await decryptValue(encryptedData, key, iv, salt);
                    } catch(err) {
                      console.warn("Decryption issue", err);
                      return encryptedData;
                    }
                } else {
                    return encryptedData;
                }
            } catch (error) {
                console.error("Decryption process failed:", error);
                return encryptedData;
            }
        },
        generateRandomKey: async function() {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Key generation disabled.');
                return null;
            }
             try {
                const key = await window.crypto.subtle.generateKey(
                    {
                        name: "AES-CBC",
                        length: 256,
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                const exported = await window.crypto.subtle.exportKey(
                    "raw",
                    key
                );
                return this.arrayBufferToBase64(exported);
            } catch (error) {
                console.error("Key generation failed:", error);
                return null;
            }
        },
        generateRandomIV: function() {
          if (!window.crypto || !window.crypto.getRandomValues) {
              console.warn('Web Crypto API not supported. IV generation disabled.');
              return null;
          }
            const iv = new Uint8Array(16);
            window.crypto.getRandomValues(iv);
            return this.arrayBufferToBase64(iv.buffer);
        },
        generateRandomSalt: function() {
          if (!window.crypto || !window.crypto.getRandomValues) {
              console.warn('Web Crypto API not supported. Salt generation disabled.');
              return null;
          }
            const salt = new Uint8Array(16);
            window.crypto.getRandomValues(salt);
            return this.arrayBufferToBase64(salt.buffer);
        },
        arrayBufferToBase64: function(buffer) {
          let binary = '';
          const bytes = new Uint8Array(buffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        },

        base64ToArrayBuffer: function(base64) {
          const binary_string = atob(base64);
          const len = binary_string.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
          }
          return bytes.buffer;
        },
        sanitizeString: function(str) {
          return str.replace(/[^a-zA-Z0-9]/g, '');
        },
        isValidBase64: function(str) {
            try {
                return btoa(atob(str)) === str;
            } catch (e) {
                return false;
            }
        },
        stringToUint8Array: function(str) {
          const enc = new TextEncoder();
          return enc.encode(str);
        },
        uint8ArrayToString: function(arr) {
          const dec = new TextDecoder();
          return dec.decode(arr);
        },
        isEncryptionSupported: function() {
          return !!(window.crypto && window.crypto.subtle);
        }
  },
  "fn": {
    "update": async function() {
        const pJS = this;
        if (!pJS.plugins.encrypt.enable) return;

        const config = pJS.actualOptions;
        const encryptPlugin = pJS.plugins;
        let { key, iv, algorithm, salt } = config.encrypt_config;

        if (!encryptPlugin.isEncryptionSupported()) {
          console.warn('Web Crypto API not supported. Encryption disabled.');
          pJS.plugins.encrypt.enable = false;
          return;
        }

        if (!key || key === 'YOUR_SECURE_KEY') {
            console.warn('Encryption key is not set. Generating a random key.');
            const newKey = await encryptPlugin.generateRandomKey();
            if (newKey) {
                config.encrypt_config.key = newKey;
                key = newKey;
                try {
                    sessionStorage.setItem('encryptionKey', newKey); //Use sessionStorage
                } catch (e) {
                    console.warn("sessionStorage not available. Key will not persist.");
                }
                console.log('New encryption key generated:', newKey);
            } else {
                console.error('Failed to generate encryption key. Encryption disabled.');
                pJS.plugins.encrypt.enable = false;
                return;
            }
        } else {
            try {
                key = sessionStorage.getItem('encryptionKey') || key; //Use sessionStorage
            } catch (e) {
                console.warn("sessionStorage not available. Using default key.");
            }
            config.encrypt_config.key = key;
        }

        if (!iv || iv === 'YOUR_IV_KEY') {
            console.warn('Encryption IV is not set. Generating a random IV.');
            const newIV = encryptPlugin.generateRandomIV();
            if (newIV) {
                config.encrypt_config.iv = newIV;
                iv = newIV;
                try {
                    sessionStorage.setItem('encryptionIV', newIV); //Use sessionStorage
                } catch (e) {
                    console.warn("sessionStorage not available. IV will not persist.");
                }
                console.log('New encryption IV generated:', newIV);
            } else {
                console.error('Failed to generate encryption IV. Encryption disabled.');
                pJS.plugins.encrypt.enable = false;
                return;
            }
        } else {
            try {
                iv = sessionStorage.getItem('encryptionIV') || iv; //Use sessionStorage
            } catch (e) {
                console.warn("sessionStorage not available. Using default IV.");
            }
            config.encrypt_config.iv = iv;
        }

        if (!salt || salt === 'YOUR_SALT') {
            console.warn('Encryption Salt is not set. Generating a random Salt.');
            const newSalt = encryptPlugin.generateRandomSalt();
            if (newSalt) {
                config.encrypt_config.salt = newSalt;
                salt = newSalt;
                try {
                    sessionStorage.setItem('encryptionSalt', newSalt); //Use sessionStorage
                } catch (e) {
                    console.warn("sessionStorage not available. Salt will not persist.");
                }
                console.log('New encryption salt generated:', newSalt);
            } else {
                console.error('Failed to generate encryption salt. Encryption disabled.');
                pJS.plugins.encrypt.enable = false;
                return;
            }
        } else {
            try {
                salt = sessionStorage.getItem('encryptionSalt') || salt; //Use sessionStorage
            } catch (e) {
                console.warn("sessionStorage not available. Using default salt.");
            }
            config.encrypt_config.salt = salt;
        }

        if (config?.plugins?.encrypt?.dataFields) {
            const { dataFields } = config.plugins.encrypt;

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
                        let originalValue = target[lastPart];

                        if (Array.isArray(originalValue)) {
                            const encryptedArray = [];
                            for(let i = 0; i < originalValue.length; i++){
                                try {
                                    const item = originalValue[i];
                                    if (typeof item === 'string') {
                                        encryptedArray[i] = await encryptPlugin.customEncrypt(item, key, iv, algorithm, salt);
                                    } else {
                                        encryptedArray[i] = item;
                                    }
                                } catch (itemError) {
                                    console.warn(`Encryption of array item failed:`, itemError);
                                    encryptedArray[i] = originalValue[i];
                                }
                            }

                            target[lastPart] = encryptedArray;

                        } else if(typeof originalValue === 'string'){
                            target[lastPart] = await encryptPlugin.customEncrypt(originalValue, key, iv, algorithm, salt);
                        }
                    } catch (error) {
                        console.error("Encryption update failed:", error);
                    }
                }
            }
        }
    },
    "draw": async function() {
        const pJS = this;
        if (!pJS.plugins.encrypt.enable) return;

        const config = pJS.actualOptions;
        const encryptPlugin = pJS.plugins;
        let { key, iv, algorithm, salt } = config.encrypt_config;

        if (!encryptPlugin.isEncryptionSupported()) {
          return;
        }

        try {
            key = sessionStorage.getItem('encryptionKey') || key; //Use sessionStorage
            iv = sessionStorage.getItem('encryptionIV') || iv; //Use sessionStorage
            salt = sessionStorage.getItem('encryptionSalt') || salt; //Use sessionStorage
        } catch (e) {
            console.warn("sessionStorage not available. Using default key/iv/salt.");
        }

        if (config?.plugins?.encrypt?.dataFields) {
            const { dataFields } = config.plugins.encrypt;

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
                        let encryptedValue = target[lastPart];

                        if (Array.isArray(encryptedValue)) {
                            const decryptedArray = [];
                            for(let i = 0; i < encryptedValue.length; i++){
                                try {
                                    const item = encryptedValue[i];
                                    if (typeof item === 'string') {
                                      if(encryptPlugin.isValidBase64(item)){
                                        decryptedArray[i] = await encryptPlugin.decrypt(item, key, iv, algorithm, salt);
                                      } else {
                                        decryptedArray[i] = item;
                                      }

                                    } else {
                                        decryptedArray[i] = item;
                                    }
                                } catch (itemError) {
                                    console.warn("Decryption of array item failed:", itemError);
                                    decryptedArray[i] = encryptedValue[i];
                                }
                            }
                            target[lastPart] = decryptedArray;
                        } else if(typeof encryptedValue === 'string'){
                           if(encryptPlugin.isValidBase64(encryptedValue)){
                              target[lastPart] = await encryptPlugin.decrypt(encryptedValue, key, iv, algorithm, salt);
                           } else {
                             target[lastPart] = encryptedValue;
                           }

                        }
                    } catch (error) {
                        console.error("Decryption draw failed:", error);
                    }
                }
            }
        }
    }
}
});