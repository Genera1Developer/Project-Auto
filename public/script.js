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
                // Use AES encryption instead of btoa
                encryptData({ username: username, password: password, captcha: captcha })
                    .then(encryptedData => {
                        return Promise.all([encryptedData, generateAndStoreSalt()]);
                    })
                    .then(([encryptedData, salt]) => {
                        fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Encryption': 'true', // Indicate encryption
                                'X-Salt': salt  // Send the salt to the server
                            },
                            body: JSON.stringify({ data: encryptedData }) // Send encrypted data
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
                                 // Show success alert
                                 showAlert('Login successful. Secure connection established.', 'success');
                            } else {
                                errorMessage.textContent = data.message || 'Invalid username or password.';
                                encryptionStatus.textContent = 'Login failed. Encryption in transit.';
                                 // Show error alert
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
                             // Show error alert
                             showAlert('An error occurred during login. Please try again later.', 'error');
                        });
                    })
                    .catch(encryptionError => {
                        if (encryptionAnimation) {
                            encryptionAnimation.style.display = 'none';
                        }
                        console.error('Encryption Error:', encryptionError);
                        errorMessage.textContent = 'Encryption failed.';
                        encryptionStatus.textContent = 'Encryption error.';
                         // Show error alert
                         showAlert('Encryption failed. Please try again.', 'error');
                    });
            }, 1500); // Simulate 1.5 seconds of encryption
        });
    }

    // AES Encryption function (using CryptoJS)
    async function encryptData(data) {
        const salt = localStorage.getItem('encryptionSalt');  // Retrieve stored salt
        const key = CryptoJS.enc.Utf8.parse(generateKey(salt));
        const iv = CryptoJS.enc.Utf8.parse(generateIV(salt));

        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    function generateKey(salt) {
        // Deriving a key from the salt (example: SHA256 hash)
        const combined = "YourSecretKeyPrefix" + salt;
        const hash = CryptoJS.SHA256(combined).toString();
        return hash.substring(0, 32); // AES-256 requires a 32-byte key
    }

    function generateIV(salt) {
          const combined = "YourSecretIVPrefix" + salt;
          const hash = CryptoJS.SHA256(combined).toString();
          return hash.substring(0, 16); // AES requires a 16-byte IV

    }
    async function generateAndStoreSalt() {
          let salt = localStorage.getItem('encryptionSalt');
          if (!salt) {
              salt = CryptoJS.lib.WordArray.random(16).toString();
              localStorage.setItem('encryptionSalt', salt);
          }
          return salt;
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
            alertContainer.classList.add('fade-out'); // Add fade-out class
            setTimeout(() => {
                alertContainer.remove();
            }, 500); // Wait for fade-out animation
        }, 3000); // Adjust time as needed
    }
});