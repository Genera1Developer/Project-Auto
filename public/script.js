document.addEventListener('DOMContentLoaded', function() {
  const urlForm = document.getElementById('urlForm');
  const urlInput = document.getElementById('urlInput');
  const proxyUrl = '/uv/service/';
  const encryptionKey = generateEncryptionKey(); // Generate a unique encryption key

  urlForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let url = urlInput.value;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Encrypt the URL before passing it to the proxy
    const encryptedUrl = encryptURL(url, encryptionKey);
    const encodedUrl = encodeURIComponent(encryptedUrl);

    window.location.href = proxyUrl + encodedUrl;
  });

  // Function to generate a random encryption key (for demonstration purposes)
  function generateEncryptionKey() {
    const key = CryptoJS.lib.WordArray.random(16).toString();
    sessionStorage.setItem('encryptionKey', key);
    return key;
  }

  // Function to encrypt the URL using AES
  function encryptURL(url, key) {
    const encrypted = CryptoJS.AES.encrypt(url, key).toString();
    return encrypted;
  }
});

// Include CryptoJS library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js';
script.onload = function () {
  console.log('CryptoJS loaded');
};
document.head.appendChild(script);