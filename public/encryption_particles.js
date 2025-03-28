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

            const encryptValue = async (text, secretKey, iv, algorithm, salt) => {
              try {
                if (!secretKey || !iv || !algorithm || !salt) {
                  console.warn('Encryption parameters are missing. Encryption disabled.');
                  return text;
                }
                if(secretKey.length < 32 || iv.length < 16 || salt.length < 16){
                  console.warn('Encryption Key or IV or Salt length too short');
                  return text;
                }

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
                          encryptedArray.push(await encryptValue(item, key, iv, algorithm, salt));
                      } else {
                          encryptedArray.push(item);
                      }
                  }
                  return encryptedArray;
              } else if (typeof data === 'string'){
                  return await encryptValue(data, key, iv, algorithm, salt);
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

            const decryptValue = async (encryptedBase64, secretKey, iv, algorithm, salt) => {
              try {
                 if (!secretKey || !iv || !algorithm || !salt) {
                  console.warn('Decryption parameters are missing. Decryption disabled.');
                  return encryptedBase64;
                }
                if(secretKey.length < 32 || iv.length < 16 || salt.length < 16){
                  console.warn('Decryption Key or IV or Salt length too short');
                  return encryptedBase64;
                }
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
                const originalData = new Uint8Array(decryptedData).slice(saltLength);

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
                            decryptedArray.push(await decryptValue(item, key, iv, algorithm, salt));
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
                      return await decryptValue(encryptedData, key, iv, algorithm, salt);
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
                const decoded = atob(str);
                const reencoded = btoa(decoded);
                return reencoded === str;
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
        },
         uint8ArrayToHexString: function(arr) {
            return Array.from(arr, function(byte) {
                return ('0' + (byte & 0xFF).toString(16)).slice(-2);
            }).join('');
        },

        hexStringTouint8Array: function(hexString) {
            const byteLength = hexString.length / 2;
            const uint8Array = new Uint8Array(byteLength);

            for (let i = 0; i < byteLength; i++) {
                const hexByte = hexString.substring(i * 2, i * 2 + 2);
                uint8Array[i] = parseInt(hexByte, 16);
            }

            return uint8Array;
        },
        bufferToString: function(buf) {
          return String.fromCharCode.apply(null, new Uint16Array(buf));
        },
        stringToBuffer: function(str) {
          const buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
          const bufView = new Uint16Array(buf);
          for (let i=0, strLen=str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
          }
          return buf;
        },
      getCryptoDetails: function(){
          let key = localStorage.getItem('encryptionKey') || sessionStorage.getItem('encryptionKey') || this.encrypt_config.key;
          let iv = localStorage.getItem('encryptionIV') || sessionStorage.getItem('encryptionIV') || this.encrypt_config.iv;
          let salt = localStorage.getItem('encryptionSalt') || sessionStorage.getItem('encryptionSalt') || this.encrypt_config.salt;

          return {
              key: key,
              iv: iv,
              salt: salt
          }
      },
      encryptFields: async function(data, dataFields, encryptPlugin, key, iv, algorithm, salt){

          for (const fieldPath of dataFields) {
              let target = data;
              const pathParts = fieldPath.split('.');
              for (let i = 0; i < pathParts.length - 1; i++) {
                  if(!target || typeof target !== 'object') continue;
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
      },
      decryptFields: async function(data, dataFields, encryptPlugin, key, iv, algorithm, salt){
            for (const fieldPath of dataFields) {
                let target = data;
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
      },
      throttle: function(func, limit) {
          let lastFunc;
          let lastRan;
          return function() {
              const context = this;
              const args = arguments;
              if (!lastRan) {
                  func.apply(context, args);
                  lastRan = Date.now();
              } else {
                  clearTimeout(lastFunc);
                  lastFunc = setTimeout(function() {
                      if ((Date.now() - lastRan) >= limit) {
                          func.apply(context, args);
                          lastRan = Date.now();
                      }
                  }, limit - (Date.now() - lastRan));
              }
          }
      },
      storeCryptoDetails: function(key, iv, salt) {
          try {
            localStorage.setItem('encryptionKey', key);
            localStorage.setItem('encryptionIV', iv);
            localStorage.setItem('encryptionSalt', salt);
          } catch (e) {
              console.warn("localStorage not available. Crypto details will not persist.");
              try{
                  sessionStorage.setItem('encryptionKey', key);
                  sessionStorage.setItem('encryptionIV', iv);
                  sessionStorage.setItem('encryptionSalt', salt);
              } catch(e){
                  console.warn("SessionStorage not available. Crypto details will not persist.");
              }
          }
      },
      getCryptoFromLocalStorage: function(){
          try{
              let key = localStorage.getItem('encryptionKey');
              let iv = localStorage.getItem('encryptionIV');
              let salt = localStorage.getItem('encryptionSalt');

              return {
                  key: key,
                  iv: iv,
                  salt: salt
              }
          } catch(e){
              console.warn("localStorage not available.")
          }
      },
       getCryptoFromSessionStorage: function(){
          try{
              let key = sessionStorage.getItem('encryptionKey');
              let iv = sessionStorage.getItem('encryptionIV');
              let salt = sessionStorage.getItem('encryptionSalt');

              return {
                  key: key,
                  iv: iv,
                  salt: salt
              }
          } catch(e){
              console.warn("sessionStorage not available.")
          }
      },
      generateKeyAndIV: async function() {
          try {
              const key = await this.generateRandomKey();
              const iv = this.generateRandomIV();
              const salt = this.generateRandomSalt();
              return { key, iv, salt };
          } catch (error) {
              console.error("Failed to generate key and IV:", error);
              return null;
          }
      },
      areCryptoDetailsValid: function(key, iv, salt) {
          return key && key !== 'YOUR_SECURE_KEY' &&
                 iv && iv !== 'YOUR_IV_KEY' &&
                 salt && salt !== 'YOUR_SALT' &&
                 this.isValidBase64(key) && this.isValidBase64(iv) && this.isValidBase64(salt) &&
                 key.length >= 32 && iv.length >= 16 && salt.length >= 16;
      },
      clearCryptoDetails: function() {
          try {
              localStorage.removeItem('encryptionKey');
              localStorage.removeItem('encryptionIV');
              localStorage.removeItem('encryptionSalt');
              localStorage.removeItem('passwordHash');
          } catch (e) {
              console.warn("localStorage not available.");
          }
          try {
              sessionStorage.removeItem('encryptionKey');
              sessionStorage.removeItem('encryptionIV');
              sessionStorage.removeItem('encryptionSalt');
              sessionStorage.removeItem('passwordHash');
          } catch (e) {
              console.warn("sessionStorage not available.");
          }
      },
      throttleEncryption: function(func, limit) {
            let lastFunc;
            let lastRan;
            return function() {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function() {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            }
        },
      isLocalStorageAvailable: function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        },
        deriveKeyFromPassword: async function(password, salt) {
            if (!window.crypto || !window.crypto.subtle) {
                console.warn('Web Crypto API not supported. Key derivation disabled.');
                return null;
            }
            try {
                const enc = new TextEncoder();
                const passwordKey = await crypto.subtle.importKey(
                    "raw",
                    enc.encode(password),
                    { name: "PBKDF2" },
                    false,
                    ["deriveKey", "deriveBits"]
                );

                const derivedKey = await crypto.subtle.deriveKey(
                    {
                        name: "PBKDF2",
                        salt: this.base64ToArrayBuffer(salt),
                        iterations: 10000,
                        hash: "SHA-256"
                    },
                    passwordKey,
                    { name: "AES-CBC", length: 256 },
                    true,
                    ["encrypt", "decrypt"]
                );

                const exported = await crypto.subtle.exportKey(
                    "raw",
                    derivedKey
                );
                return this.arrayBufferToBase64(exported);

            } catch (error) {
                console.error("Key derivation failed:", error);
                return null;
            }
        },
        storePasswordHash: async function(password) {
          try {
            const enc = new TextEncoder();
            const data = enc.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            sessionStorage.setItem('passwordHash', hashHex);
          } catch (e) {
              console.warn("sessionStorage not available or hashing failed.", e);
          }
      },

      verifyPassword: async function(password) {
          try {
            const enc = new TextEncoder();
            const data = enc.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            const storedHash = sessionStorage.getItem('passwordHash');
            return hashHex === storedHash;
          } catch (e) {
              console.warn("sessionStorage not available or hashing failed.", e);
              return false;
          }
      },
      async initializeEncryption(password) {
          if (!password) {
              console.warn('Password is required to initialize encryption.');
              return false;
          }

          let salt = localStorage.getItem('encryptionSalt') || sessionStorage.getItem('encryptionSalt');
          if (!salt) {
              salt = this.generateRandomSalt();
              if (!salt) return false; // Salt generation failed
              if (this.isLocalStorageAvailable()) {
                  this.storeCryptoDetails('', '', salt); // Store the salt in localStorage
              } else if (this.isSessionStorageAvailable()){
                  try{
                      sessionStorage.setItem('encryptionSalt', salt);
                  } catch(e) {
                      console.warn("Session storage failed")
                  }
              }

          }

          let key = await this.deriveKeyFromPassword(password, salt);
          if (!key) {
              console.error('Failed to derive key from password.');
              return false;
          }

          let iv = this.generateRandomIV();
          if (!iv) {
              console.error('Failed to generate IV.');
              return false;
          }

          if (this.isLocalStorageAvailable()) {
              this.storeCryptoDetails(key, iv, salt);
          } else if (this.isSessionStorageAvailable()){
              try{
                 sessionStorage.setItem('encryptionKey', key);
                 sessionStorage.setItem('encryptionIV', iv);
                 sessionStorage.setItem('encryptionSalt', salt);
              } catch(e){
                  console.warn("Session Storage failed");
              }
          }
          await this.storePasswordHash(password); // Store the password hash

          return true;
      },
      isSessionStorageAvailable: function() {
            try {
                sessionStorage.setItem('test', 'test');
                sessionStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        },
        isEncryptionEnabled: function(){
            return this.encrypt.enable;
        },
        toggleEncryption: function(enable){
          this.encrypt.enable = enable;
          if(!enable) {
            this.clearCryptoDetails();
          }
        },
        throttleDecryption: function(func, limit) {
            let lastFunc;
            let lastRan;
            return function() {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function() {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            }
        },
        throttleUpdate: function(func, limit) {
            let lastFunc;
            let lastRan;
            return function() {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function() {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            }
        },
        updateEncryptionFields: async function() {
            const pJS = this;
            const config = pJS.actualOptions;

            if (!pJS.plugins.isEncryptionEnabled()) return;

            const encryptPlugin = pJS.plugins;
            let { key, iv, algorithm, salt } = config.encrypt_config;

            if (!encryptPlugin.isEncryptionSupported()) {
                console.warn('Web Crypto API not supported. Encryption disabled.');
                encryptPlugin.toggleEncryption(false);
                return;
            }

            try {
                let cryptoDetails = encryptPlugin.getCryptoDetails();
                let storedKey = cryptoDetails?.key;
                let storedIv = cryptoDetails?.iv;
                let storedSalt = cryptoDetails?.salt;

                if (encryptPlugin.areCryptoDetailsValid(storedKey, storedIv, storedSalt)) {
                    key = storedKey;
                    iv = storedIv;
                    salt = storedSalt;
                    config.encrypt_config.key = key;
                    config.encrypt_config.iv = iv;
                    config.encrypt_config.salt = salt;
                } else if (!encryptPlugin.areCryptoDetailsValid(key, iv, salt)) {
                    console.warn('Encryption key/IV/Salt are not set or invalid. Generating new ones.');
                    const newCrypto = await encryptPlugin.generateKeyAndIV();
                    if (newCrypto) {
                        key = newCrypto.key;
                        iv = newCrypto.iv;
                        salt = newCrypto.salt;
                        config.encrypt_config.key = key;
                        config.encrypt_config.iv = iv;
                        config.encrypt_config.salt = salt;
                        encryptPlugin.storeCryptoDetails(key, iv, salt);
                        console.log('New encryption key/IV/Salt generated and stored.');
                    } else {
                        console.error('Failed to generate encryption key/IV/Salt. Encryption disabled.');
                        encryptPlugin.toggleEncryption(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error setting up encryption:", err);
                encryptPlugin.toggleEncryption(false);
                return;
            }

            if (config?.plugins?.encrypt?.dataFields) {
                await encryptPlugin.encryptFields(config, config.plugins.encrypt.dataFields, encryptPlugin, key, iv, algorithm, salt);
            }
        },
        updateDecryptionFields: async function() {
            const pJS = this;
            const config = pJS.actualOptions;

            if (!pJS.plugins.isEncryptionEnabled()) return;

            const encryptPlugin = pJS.plugins;
            let { key, iv, algorithm, salt } = config.encrypt_config;

            if (!encryptPlugin.isEncryptionSupported()) {
                return;
            }

            try {
                let cryptoDetails = encryptPlugin.getCryptoDetails();
                let storedKey = cryptoDetails?.key;
                let storedIv = cryptoDetails?.iv;
                let storedSalt = cryptoDetails?.salt;

                if (encryptPlugin.areCryptoDetailsValid(storedKey, storedIv, storedSalt)) {
                    key = storedKey;
                    iv = storedIv;
                    salt = storedSalt;
                    config.encrypt_config.key = key;
                    config.encrypt_config.iv = iv;
                    config.encrypt_config.salt = salt;
                }
            } catch (e) {
                console.warn("localStorage/sessionStorage not available. Using default key.");
            }

            if (config?.plugins?.encrypt?.dataFields) {
                await encryptPlugin.decryptFields(config, config.plugins.encrypt.dataFields, encryptPlugin, key, iv, algorithm, salt);
            }
        },
  },
  "fn": {
    "update": async function() {
        const pJS = this;
        const throttledUpdateEncryption = pJS.plugins.throttleUpdate(pJS.plugins.updateEncryptionFields.bind(pJS.plugins), 500);
        await throttledUpdateEncryption();
    },
    "draw": async function() {
        const pJS = this;
        const throttledUpdateDecryption = pJS.plugins.throttleDecryption(pJS.plugins.updateDecryptionFields.bind(pJS.plugins), 500);
        await throttledUpdateDecryption();
    },
     "destroy": function() {
        this.plugins.clearCryptoDetails();
        }
},
  "tmp": {}
});