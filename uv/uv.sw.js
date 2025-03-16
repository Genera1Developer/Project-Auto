self.importScripts('./uv.bundle.js', './uv.config.js');

const sw = new UVServiceWorker();

const encryptionEnabledDomains = ['example.com'];
const encryptionKeyName = 'encryptionKey';

const generateEncryptionKey = async () => {
    try {
        const key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedKey = await crypto.subtle.exportKey("jwk", key);
        localStorage.setItem(encryptionKeyName, JSON.stringify(exportedKey));
        return exportedKey;
    } catch (error) {
        console.error('Key generation failed:', error);
        throw error;
    }
};

const getEncryptionKey = async () => {
    const storedKey = localStorage.getItem(encryptionKeyName);
    if (storedKey) {
        try {
            return JSON.parse(storedKey);
        } catch (error) {
            console.error("Error parsing stored key, regenerating:", error);
            localStorage.removeItem(encryptionKeyName);
            return await generateEncryptionKey();
        }
    } else {
        return await generateEncryptionKey();
    }
};

const encrypt = async (data, key) => {
    try {
        const importedKey = await crypto.subtle.importKey(
            "jwk",
            key,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(data);
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 128,
            },
            importedKey,
            encoded
        );
        return {
            ciphertext: Array.from(new Uint8Array(ciphertext)),
            iv: Array.from(iv),
        };
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
};

const decrypt = async (data, key, iv) => {
    try {
        const importedKey = await crypto.subtle.importKey(
            "jwk",
            key,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        const ciphertext = new Uint8Array(data);
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: new Uint8Array(iv),
                tagLength: 128,
            },
            importedKey,
            ciphertext
        );
        const decoded = new TextDecoder().decode(decrypted);
        return decoded;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
};

const shouldEncrypt = (url) => {
    const hostname = new URL(url).hostname;
    return encryptionEnabledDomains.includes(hostname);
};

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (shouldEncrypt(event.request.url) && url.pathname !== '/encryption-status') {
        console.log(`Encrypting request to ${url.hostname}`);

        const handleEncryptedRequest = async () => {
            try {
                const encryptionKey = await getEncryptionKey();
                const request = await fetch(event.request.clone());

                if (!request.ok) {
                    throw new Error(`HTTP error! status: ${request.status}`);
                }

                let data = await request.text();
                const encryptedData = await encrypt(data, encryptionKey);

                const encryptedResponse = new Response(JSON.stringify(encryptedData), {
                    headers: { 'Content-Type': 'application/json', 'X-Encrypted': 'true' }
                });
                return encryptedResponse;
            } catch (error) {
                console.error('Request or encryption error:', error);
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', 'X-Encrypted': 'true' }
                });
            }
        };

        const handleDecryptedResponse = async () => {
            try {
                const encryptionKey = await getEncryptionKey();
                const response = await fetch(event.request.clone());
                if (!response.ok) {
                   return response;
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return response;
                }

                let data = await response.json();
                if (!data.ciphertext || !data.iv) {
                    return new Response("Invalid encrypted format", { status: 400 });
                }
                const decryptedData = await decrypt(data.ciphertext, encryptionKey, data.iv);
                return new Response(decryptedData, {
                    headers: { 'Content-Type': 'text/html' }
                });
            } catch (error) {
                console.error('Decryption error:', error);
                return new Response('Decryption failed', { status: 500 });
            }
        };
        
        event.respondWith(handleDecryptedResponse());

    } else if (url.pathname === '/encryption-status') {
        event.respondWith(new Response(JSON.stringify({ encryptionEnabled: shouldEncrypt(url) }), {
            headers: { 'Content-Type': 'application/json' }
        }));
    }
    
    else {
        event.respondWith(sw.fetch(event));
    }
});
edit filepath: public/particles.json
content: {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#00ff00"
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
        "color": "#00ff00",
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
      "background_color": "#000"
    }
  }