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
                performLogin(username, password, captcha, errorMessage, encryptionStatus, encryptionAnimation);
            }, 1500);
        });
    }

    async function performLogin(username, password, captcha, errorMessage, encryptionStatus, encryptionAnimation) {
        try {
            const saltValue = await generateAndStoreSalt();
            const [encryptedData, hmac] = await Promise.all([
                encryptData({ username: username, password: password, captcha: captcha }, saltValue),
                generateAndStoreHmac({ username: username, password: password, captcha: captcha }, saltValue)
            ]);

            const encryptedHmac = await encryptHmac(hmac, saltValue);

            const keyPrefix = sessionStorage.getItem('keyPrefix');
            const ivPrefix = sessionStorage.getItem('ivPrefix');
            const iv = sessionStorage.getItem('currentIV');
            const hmacIV = sessionStorage.getItem('hmacIV');

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Encryption': 'true',
                    'X-Salt': saltValue,
                    'X-HMAC': encryptedHmac,
                    'X-Key-Prefix': keyPrefix,
                    'X-IV-Prefix': ivPrefix,
                    'X-IV': iv,
                    'X-HMAC-IV': hmacIV,
                },
                body: JSON.stringify({ data: encryptedData })
            });

            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'none';
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

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
        } catch (error) {
            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'none';
            }
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred during login.';
            encryptionStatus.textContent = 'Connection error.';
            showAlert('An error occurred during login. Please try again later.', 'error');
        }
    }



    async function encryptData(data, salt) {
        // Use Web Crypto API for encryption
        return await encryptDataWebCrypto(data, salt);
    }


    async function generateAndStoreHmac(data, salt) {
        return await generateAndStoreHmacWebCrypto(data, salt);
    }

    async function encryptHmac(hmac, salt) {
        return await encryptHmacWebCrypto(hmac, salt);
    }

    function generateKey(salt) {
         if (!salt || typeof salt !== 'string') {
            console.error("Invalid salt:", salt);
            salt = 'default_salt';
          }
        const combined =  salt + getKeyPrefix();
        const hash = CryptoJS.SHA256(combined).toString();
        return hash.substring(0, 32);
    }

    function generateIV(salt) {
         if (!salt || typeof salt !== 'string') {
           console.error("Invalid salt:", salt);
           salt = 'default_salt';
         }
        const combined = salt + getIVPrefix();
        const hash = CryptoJS.SHA256(combined).toString();
        return hash.substring(0, 16);

    }
    async function generateAndStoreSalt() {
        let salt = sessionStorage.getItem('encryptionSalt');
        if (!salt) {
            try {
                const saltBuffer = new Uint8Array(16);
                window.crypto.getRandomValues(saltBuffer);
                salt = arrayBufferToBase64(saltBuffer.buffer);
                sessionStorage.setItem('encryptionSalt', salt);
            } catch (e) {
                console.error("Salt generation error:", e);
                 showAlert('Salt Generation Failed. Secure login disabled.', 'error');
                throw new Error("Salt generation failed");
            }
        }
        return salt;
    }

    function getKeyPrefix() {
        let prefix = sessionStorage.getItem('keyPrefix');
        if (!prefix) {
            try{
                const prefixBuffer = new Uint8Array(8);
                window.crypto.getRandomValues(prefixBuffer);
                prefix = arrayBufferToBase64(prefixBuffer.buffer);
                sessionStorage.setItem('keyPrefix', prefix);
            } catch (e) {
                console.error("Key Prefix generation error:", e);
                showAlert('Key Prefix Generation Failed. Secure login disabled.', 'error');
                throw new Error("Key Prefix generation failed");
            }
        }
        return prefix;
    }

    function getIVPrefix() {
        let prefix = sessionStorage.getItem('ivPrefix');
        if (!prefix) {
           try{
                const prefixBuffer = new Uint8Array(8);
                window.crypto.getRandomValues(prefixBuffer);
                prefix = arrayBufferToBase64(prefixBuffer.buffer);
                sessionStorage.setItem('ivPrefix', prefix);
           } catch (e) {
                console.error("IV Prefix generation error:", e);
                showAlert('IV Prefix Generation Failed. Secure login disabled.', 'error');
                throw new Error("IV Prefix generation failed");
           }
        }
        return prefix;
    }

    async function getHmacSecret() {
         let secret = sessionStorage.getItem('hmacSecret');
         if (!secret) {
             try {
                 const secretBuffer = new Uint8Array(32);
                 window.crypto.getRandomValues(secretBuffer);
                 secret = arrayBufferToBase64(secretBuffer.buffer);
                  sessionStorage.setItem('hmacSecret', secret);
             } catch (e) {
                 console.error("HMAC secret generation error:", e);
                 showAlert('HMAC Secret Generation Failed. Secure login disabled.', 'error');
                 throw new Error("HMAC secret generation failed");
             }
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

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    async function encryptDataWebCrypto(data, salt) {
        try {
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(generateKey(salt)),
                { name: "AES-CBC", length: 256 },
                false,
                ["encrypt"]
            );

            let iv = sessionStorage.getItem('currentIV');
            if (!iv){
                 try{
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16)); // Generate a new IV
                    iv = arrayBufferToBase64(ivBuffer.buffer);
                    sessionStorage.setItem('currentIV', iv);
                 } catch (e) {
                    console.error("IV generation error:", e);
                    showAlert('IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("IV generation failed");
                }
            }
            iv = base64ToArrayBuffer(sessionStorage.getItem('currentIV'));

            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const result = await window.crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                },
                keyMaterial,
                encodedData
            );

             const encryptedData = arrayBufferToBase64(result);

            return encryptedData;

        } catch (error) {
            console.error("WebCrypto encryption error:", error);
            showAlert('Encryption Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto encryption failed: " + error.message);
        }
    }
    async function generateHmacWebCrypto(data, salt) {
        try {
            const hmacKeyMaterial = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(await getHmacSecret() + salt),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );

            const hmac = await window.crypto.subtle.sign(
                "HMAC",
                hmacKeyMaterial,
                new TextEncoder().encode(JSON.stringify(data))
            );

            return arrayBufferToBase64(hmac);

        } catch (error) {
            console.error("WebCrypto HMAC generation error:", error);
            showAlert('HMAC Generation Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC generation failed: " + error.message);
        }
    }

    async function generateAndStoreHmacWebCrypto(data, salt) {
        try {
            const hmac = await generateHmacWebCrypto(data, salt);
            // No need to store HMAC in sessionStorage, as it's immediately used
            return hmac;
        } catch (e) {
            console.error("WebCrypto HMAC generation error", e);
            showAlert('HMAC Generation Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC generation failed");
        }
    }

    async function encryptHmacWebCrypto(hmac, salt) {
        try {
            const hmacEncryptionKeyMaterial = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(generateKey(salt)),
                { name: "AES-CBC", length: 256 },
                false,
                ["encrypt"]
            );

            let iv = sessionStorage.getItem('hmacIV');
            if (!iv){
                try {
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16));
                    iv = arrayBufferToBase64(ivBuffer.buffer);
                    sessionStorage.setItem('hmacIV', iv);
                 } catch (e) {
                    console.error("HMAC IV generation error:", e);
                    showAlert('HMAC IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("HMAC IV generation failed");
                 }
            }
            iv = base64ToArrayBuffer(sessionStorage.getItem('hmacIV'));

            const encryptedHmacBuffer = await window.crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                },
                hmacEncryptionKeyMaterial,
                new TextEncoder().encode(hmac)
            );

            return arrayBufferToBase64(encryptedHmacBuffer);
        } catch (e) {
            console.error("WebCrypto HMAC encryption error:", e);
            showAlert('HMAC Encryption Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC encryption failed");
        }
    }
    function base64ToArrayBuffer(base64) {
      const binary_string = window.atob(base64);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i =0; i < len; i++){
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    // Schedule cleanup tasks.
    scheduleCleanupTasks();

    function scheduleCleanupTasks() {
        // Clear session storage at 6 AM every day.
        const now = new Date();
        const millisTill6 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0).getTime() - now.getTime();
        if (millisTill6 < 0) {
            millisTill6 += 86400000; // it's after 6am, try 6am tomorrow.
        }
        setTimeout(function() {
            clearEncryptionData();
            setInterval(clearEncryptionData, 86400000); // Run every 24 hours.
        }, millisTill6);
    }

    function clearEncryptionData() {
        sessionStorage.removeItem('encryptionSalt');
        sessionStorage.removeItem('keyPrefix');
        sessionStorage.removeItem('ivPrefix');
        sessionStorage.removeItem('hmacSecret');
        sessionStorage.removeItem('currentIV');
        sessionStorage.removeItem('hmacIV');
        // sessionStorage.removeItem('hmac'); //removed - not stored anymore
        console.log('Encryption data cleared from session storage.');
    }

    // Add check for window.crypto
    if (!window.crypto || !window.crypto.subtle) {
        console.error("Web Crypto API not supported!");
        showAlert("Web Crypto API not supported. Secure login disabled.", 'error');
    }

    // Check if running in a secure context (HTTPS)
    if (window.location.protocol !== 'https:') {
        console.warn("Website is not running on HTTPS. Encryption may not be fully secure.");
        showAlert("Website is not running on HTTPS. Encryption may not be fully secure.", 'warning');
    }

    // Implement timing attack resistant comparison
    function isEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    }

});