document.addEventListener('DOMContentLoaded', function() {
  const urlForm = document.getElementById('urlForm');
  const urlInput = document.getElementById('urlInput');
  const proxyUrl = '/uv/service/';

  urlForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let url = urlInput.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Generate encryption key for this session
    const encryptionKey = generateEncryptionKey();

    // Encrypt the URL before passing it to the proxy
    encryptURL(url, encryptionKey)
      .then(encryptedUrl => {
        const encodedUrl = encodeURIComponent(encryptedUrl);
        window.location.href = proxyUrl + encodedUrl;
      })
      .catch(error => {
        console.error("Encryption failed:", error);
        alert("Failed to encrypt URL. Please try again.");
      });
  });

  // Function to generate a cryptographically secure encryption key
  function generateEncryptionKey() {
    return new Promise((resolve, reject) => {
      crypto.subtle.generateKey(
        {
          name: "AES-CBC",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      ).then(key => {
        crypto.subtle.exportKey("jwk", key).then(exportedKey => {
          sessionStorage.setItem('encryptionKey', exportedKey.k); // Store only the key material
          resolve(exportedKey.k);
        }).catch(reject);
      }).catch(reject);
    });
  }

  // Function to encrypt the URL using AES-CBC
  function encryptURL(url, key) {
    return new Promise((resolve, reject) => {
      const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate a random IV
      const encoded = new TextEncoder().encode(url);
      crypto.subtle.importKey(
        "jwk",
        { kty: "oct", k: key, alg: "A256CBC", ext: true },
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
      ).then(cryptoKey => {
        crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            iv: iv
          },
          cryptoKey,
          encoded
        ).then(encrypted => {
          const encryptedArray = new Uint8Array(encrypted);
          const combined = new Uint8Array(iv.length + encryptedArray.length);
          combined.set(iv, 0);
          combined.set(encryptedArray, iv.length);
          const base64 = btoa(String.fromCharCode(...combined));
          resolve(base64);
        }).catch(reject);
      }).catch(reject);
    });
  }
});