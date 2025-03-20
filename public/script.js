document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('preloader-hidden');
        });
    }

    // Password Toggle
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Captcha Refresh
    const captchaImage = document.getElementById('captchaImage');
    const refreshCaptchaButton = document.querySelector('button[onclick="refreshCaptcha()"]');

    function refreshCaptcha() {
        if (captchaImage) {
            captchaImage.src = '/api/captcha?' + new Date().getTime();
        }
    }

    if (refreshCaptchaButton) {
        refreshCaptchaButton.addEventListener('click', refreshCaptcha);
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const captcha = document.getElementById('captcha').value;
            const errorMessage = document.getElementById('error-message');
            const encryptionStatus = document.getElementById('encryption-status');
            const encryptionAnimation = document.getElementById('encryptionAnimation');

            if (!username || !password || !captcha) {
                errorMessage.textContent = 'Please enter all fields.';
                return;
            }

            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'block';
            }
            errorMessage.textContent = '';
            encryptionStatus.textContent = 'Encrypting...';

            // Simulate encryption delay (for visual effect)
            setTimeout(() => {
                encryptData({ username: username, password: password, captcha: captcha })
                    .then(encryptedData => {
                        return Promise.all([encryptedData, generateAndStoreSalt()]);
                    })
                    .then(([encryptedData, salt]) => {
                        return Promise.all([encryptedData, generateAndStoreHmac(encryptedData, salt)]);
                    })
                    .then(([encryptedData, hmac]) => {
                        return Promise.all([encryptedData, encryptHmac(hmac)]);
                    })
                    .then(([encryptedData, encryptedHmac]) => {
                         fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Encryption': 'true',
                                'X-Salt': sessionStorage.getItem('encryptionSalt'),
                                'X-HMAC': encryptedHmac
                            },
                            body: JSON.stringify({ data: encryptedData })
                        })
                        .then(response => {
                            if (encryptionAnimation) {
                                encryptionAnimation.style.display = 'none';
                            }
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                errorMessage.textContent = '';
                                encryptionStatus.textContent = 'Encrypted connection established.';
                                window.location.href = '/index.html';
                                showAlert('Login successful. Secure connection established.', 'success');
                            } else {
                                errorMessage.textContent = data.message || 'Invalid username or password.';
                                encryptionStatus.textContent = 'Login failed. Encryption in transit.';
                                showAlert(data.message || 'Login failed. Check credentials and try again.', 'error');
                            }
                        })
                        .catch(error => {
                            if (encryptionAnimation) {
                                encryptionAnimation.style.display = 'none';
                            }
                            console.error('Error:', error);
                            errorMessage.textContent = 'An error occurred during login.';
                            encryptionStatus.textContent = 'Connection error.';
                            showAlert('An error occurred during login. Please try again later.', 'error');
                        });
                    })
                    .catch(hmacError => {
                        if (encryptionAnimation) {
                            encryptionAnimation.style.display = 'none';
                        }
                        console.error('HMAC Error:', hmacError);
                        errorMessage.textContent = 'HMAC generation failed.';
                        encryptionStatus.textContent = 'HMAC error.';
                         showAlert('HMAC generation failed. Please try again.', 'error');
                    })
                    .catch(encryptionError => {
                        if (encryptionAnimation) {
                            encryptionAnimation.style.display = 'none';
                        }
                        console.error('Encryption Error:', encryptionError);
                        errorMessage.textContent = 'Encryption failed.';
                        encryptionStatus.textContent = 'Encryption error.';
                         showAlert('Encryption failed. Please try again.', 'error');
                    });
            }, 1500);
        });
    }

    async function encryptData(data) {
        const salt = await generateAndStoreSalt();
        const key = CryptoJS.enc.Utf8.parse(generateKey(salt));
        const iv = CryptoJS.enc.Utf8.parse(generateIV(salt));

        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    async function generateHmac(data, salt) {
      const hmacKey = CryptoJS.SHA256(await getHmacSecret() + salt).toString();
        const hmac = CryptoJS.HmacSHA256(data, hmacKey).toString();
        return hmac;
    }

    async function generateAndStoreHmac(data, salt) {
        const hmac = await generateHmac(data, salt);
        sessionStorage.setItem('hmac', hmac);
        return hmac;
    }

    async function encryptHmac(hmac) {
        const salt = await generateAndStoreSalt();
        const hmacEncryptionKey = CryptoJS.enc.Utf8.parse(generateKey(salt));
        const hmacEncryptionIv = CryptoJS.enc.Utf8.parse(generateIV(salt));

        const encryptedHmac = CryptoJS.AES.encrypt(hmac, hmacEncryptionKey, {
            iv: hmacEncryptionIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encryptedHmac.toString();
    }

    function generateKey(salt) {
        const combined =  salt + await getKeyPrefix();
        const hash = CryptoJS.SHA256(combined).toString();
        return hash.substring(0, 32);
    }

    function generateIV(salt) {
          const combined = salt + await getIVPrefix();
          const hash = CryptoJS.SHA256(combined).toString();
          return hash.substring(0, 16);

    }
    async function generateAndStoreSalt() {
          let salt = sessionStorage.getItem('encryptionSalt');
          if (!salt) {
              salt = CryptoJS.lib.WordArray.random(16).toString();
              sessionStorage.setItem('encryptionSalt', salt);
          }
          return salt;
      }

    async function getKeyPrefix() {
        let prefix = sessionStorage.getItem('keyPrefix');
        if (!prefix) {
            prefix = CryptoJS.lib.WordArray.random(8).toString();
            sessionStorage.setItem('keyPrefix', prefix);
        }
        return prefix;
    }

     async function getIVPrefix() {
        let prefix = sessionStorage.getItem('ivPrefix');
        if (!prefix) {
            prefix = CryptoJS.lib.WordArray.random(8).toString();
            sessionStorage.setItem('ivPrefix', prefix);
        }
        return prefix;
    }

    async function getHmacSecret() {
         let secret = sessionStorage.getItem('hmacSecret');
         if (!secret) {
             secret = CryptoJS.lib.WordArray.random(16).toString();
             sessionStorage.setItem('hmacSecret', secret);
         }
         return secret;
    }


    // Particle.js Initialization
    if (typeof particlesJS === 'function') {
        particlesJS.load('particles-js', 'public/particles-config.json', function() {
            console.log('particles.js loaded - callback');
        });
    } else {
        console.warn('particlesJS function not found. Ensure particles.js is loaded.');
    }

    // Function to show a custom alert
    function showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `custom-alert ${type}`;
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);

        // Remove the alert after a few seconds
        setTimeout(() => {
            alertContainer.classList.add('fade-out');
            setTimeout(() => {
                alertContainer.remove();
            }, 500);
        }, 3000);
    }
});