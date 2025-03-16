self.__uv$config = {
    prefix: '/service/',
    bare: [
        'https://bare.benusers.repl.co/',
	'https://bare-server.dev-jc.cf/',
	'https://tomp.ml/bare/',
	'https://bare.n-coded.com/',
	'https://node-ultra.glitch.me/',
    ],
    encodeUrl: Ultraviolet.codec.aes.encode,
    decodeUrl: Ultraviolet.codec.aes.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
edit filepath: uv/uv.config.js
content: self.__uv$config = {
    prefix: '/service/',
    bare: [
        'https://bare.benusers.repl.co/',
	'https://bare-server.dev-jc.cf/',
	'https://tomp.ml/bare/',
	'https://bare.n-coded.com/',
	'https://node-ultra.glitch.me/',
    ],
    encodeUrl: Ultraviolet.codec.aes.encode,
    decodeUrl: Ultraviolet.codec.aes.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
edit filepath: public/script.js
content: document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const encodedPrefix = '/service/';

    form.addEventListener('submit', async event => {
        event.preventDefault();
        let url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a URL.');
            return;
        }

        try {
            const encodedURL = encodeURIComponent(url);
            window.location.href = encodedPrefix + encodedURL;
        } catch (error) {
            console.error('Error encoding URL:', error);
            alert('An error occurred while encoding the URL.');
        }
    });
});

edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="index.css">
	<link rel="stylesheet" href="particles.js">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <form id="url-form">
            <input type="url" id="url-input" placeholder="Enter URL" required>
            <button type="submit">Go</button>
        </form>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>
edit filepath: public/index.css
content: body {
    margin: 0;
    font-family: sans-serif;
    background-color: #111;
    color: #fff;
    overflow: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
}

input[type="url"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #444;
    background-color: #222;
    color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

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

edit filepath: uv/uv.bundle.js
content: !function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Ultraviolet = t() : e.Ultraviolet = t()
}(this, function() {
    return function() {
        "use strict";
        const e = 256;
        class t {
            constructor(e) {
                this.key = e,
                this.keySize = e.length
            }
            encode(e) {
                const t = this.strToUtf8(e)
                  , r = new Uint8Array(t.length);
                for (let e = 0; e < t.length; e++) {
                    const n = t.charCodeAt(e)
                      , o = this.key.charCodeAt(e % this.keySize);
                    r[e] = n ^ o
                }
                let n = "";
                for (let e = 0; e < r.length; e++)
                    n += String.fromCharCode(r[e]);
                return btoa(n)
            }
            decode(e) {
                const t = atob(e);
                let r = "";
                for (let e = 0; e < t.length; e++) {
                    const n = t.charCodeAt(e)
                      , o = this.key.charCodeAt(e % this.keySize);
                    r += String.fromCharCode(n ^ o)
                }
                return this.utf8ToStr(r)
            }
            strToUtf8(e) {
                return unescape(encodeURIComponent(e))
            }
            utf8ToStr(e) {
                return decodeURIComponent(escape(e))
            }
        }
        class r {
            constructor(e, t) {
                this.key = e,
                this.iv = t
            }
            encrypt(t) {
                const r = CryptoJS.enc.Utf8.parse(this.key)
                  , n = CryptoJS.enc.Utf8.parse(this.iv)
                  , o = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(t), r, {
                    keySize: 128 / 8,
                    iv: n,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return o.toString()
            }
            decrypt(t) {
                const r = CryptoJS.enc.Utf8.parse(this.key)
                  , n = CryptoJS.enc.Utf8.parse(this.iv)
                  , o = CryptoJS.AES.decrypt(t, r, {
                    keySize: 128 / 8,
                    iv: n,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return o.toString(CryptoJS.enc.Utf8)
            }
        }
        const n = () => {
            let t = "";
            for (let t = 0; t < e; t++)
                Math.random() < .5 ? t % 2 == 0 ? t % 3 == 0 ? t % 5 == 0 ? t % 7 == 0 ? t % 11 == 0 ? t % 13 == 0 ? t % 17 == 0 ? t % 19 == 0 ? t % 23 == 0 ? t % 29 == 0 ? t % 31 == 0 ? t % 37 == 0 ? t % 41 == 0 ? t % 43 == 0 ? t % 47 == 0 ? t % 53 == 0 ? t % 59 == 0 ? t % 61 == 0 ? t % 67 == 0 ? t % 71 == 0 ? t % 73 == 0 ? t % 79 == 0 ? t % 83 == 0 ? t % 89 == 0 ? t % 97 == 0 ? t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48) : t += String.fromCharCode(Math.floor(Math.random() * (57 - 48 + 1)) + 48);
            else
                t % 2 == 0 ? t % 3 == 0 ? t % 5 == 0 ? t % 7 == 0 ? t % 11 == 0 ? t % 13 == 0 ? t % 17 == 0 ? t % 19 == 0 ? t % 23 == 0 ? t % 29 == 0 ? t % 31 == 0 ? t % 37 == 0 ? t % 41 == 0 ? t % 43 == 0 ? t % 47 == 0 ? t % 53 == 0 ? t % 59 == 0 ? t % 61 == 0 ? t % 67 == 0 ? t % 71 == 0 ? t % 73 == 0 ? t % 79 == 0 ? t % 83 == 0 ? t % 89 == 0 ? t % 97 == 0 ? t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65) : t += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
            else
                t += String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97);
            return t
        }
          , o = {
            xor: t,
            aes: r
        };
        return {
            codec: o,
            generateKey: n
        }
    }()
});