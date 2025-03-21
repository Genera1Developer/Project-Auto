document.addEventListener('DOMContentLoaded', function() {
    // Utility function to safely get element by ID
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    // Preloader
    const preloader = getElement('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('preloader-hidden');
        });
    }

    // Password Toggle
    const togglePassword = querySelector('#togglePassword');
    const password = querySelector('#password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Captcha Refresh
    const captchaImage = getElement('captchaImage');
    const refreshCaptchaButton = querySelector('button[onclick="refreshCaptcha()"]');

    function refreshCaptcha() {
        if (captchaImage) {
            captchaImage.src = '/api/captcha?' + new Date().getTime();
        }
    }

    if (refreshCaptchaButton) {
        refreshCaptchaButton.addEventListener('click', refreshCaptcha);
    }

    // Login Form Submission
    const loginForm = getElement('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = getElement('username').value;
            const passwordInput = getElement('password');
            const password = passwordInput.value;
            const captcha = getElement('captcha').value;
            const errorMessage = getElement('error-message');
            const encryptionStatus = getElement('encryption-status');
            const encryptionAnimation = getElement('encryptionAnimation');

            if (!username || !password || !captcha) {
                errorMessage.textContent = 'Please enter all fields.';
                return;
            }

            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'block';
            }
            errorMessage.textContent = '';
            encryptionStatus.textContent = 'Encrypting...';

            try {
                // Hash the password before proceeding
                const hashedPassword = await hashPassword(password);
                passwordInput.value = ''; // Clear the password field immediately after hashing

                // Simulate encryption delay (for visual effect)
                setTimeout(() => {
                    performLogin(username, hashedPassword, captcha, errorMessage, encryptionStatus, encryptionAnimation);
                }, 1500);
            } catch (error) {
                if (encryptionAnimation) {
                    encryptionAnimation.style.display = 'none';
                }
                console.error('Password hashing error:', error);
                errorMessage.textContent = 'An error occurred during password hashing.';
                encryptionStatus.textContent = 'Hashing error.';
                showAlert('An error occurred during hashing. Please try again later.', 'error');
            }
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

            const keyPrefix = getKeyPrefix();
            const ivPrefix = getIVPrefix();
            const iv = localStorage.getItem('currentIV');
            const hmacIV = localStorage.getItem('hmacIV');

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
                    'X-Nonce': window.nonce,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'X-CSRF-Token': getCSRFToken() // Include CSRF token
                },
                body: JSON.stringify({ data: encryptedData })
            });

            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'none';
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
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

    async function generateAndStoreSalt() {
        let salt = sessionStorage.getItem('encryptionSalt');
        if (!salt) {
            try {
                const saltBuffer = new Uint8Array(16);
                window.crypto.getRandomValues(saltBuffer);
                salt = arrayBufferToSafeBase64(saltBuffer.buffer);
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
                prefix = arrayBufferToSafeBase64(prefixBuffer.buffer);
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
                prefix = arrayBufferToSafeBase64(prefixBuffer.buffer);
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
                secret = arrayBufferToSafeBase64(secretBuffer.buffer);
                sessionStorage.setItem('hmacSecret', secret);
            } catch (e) {
                console.error("HMAC secret generation error:", e);
                showAlert('HMAC Secret Generation Failed. Secure login disabled.', 'error');
                throw new Error("HMAC secret generation failed");
            }
        }
        return secret;
    }

    // Function to get CSRF token from meta tag
    function getCSRFToken() {
        const metaTag = querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.content : null;
    }

    // Particle.js Initialization
    if (typeof particlesJS === 'function') {
        particlesJS.load('public/particles-js', 'public/particles-config.json', function() {
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

    function base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i =0; i < len; i++){
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function encryptDataWebCrypto(data, salt) {
        try {
            const derivedKey = await deriveKeyMaterial(salt);

            let iv = localStorage.getItem('currentIV');
            if (!iv){
                try{
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16)); // Generate a new IV
                    iv = arrayBufferToSafeBase64(ivBuffer.buffer);
                    localStorage.setItem('currentIV', iv);
                } catch (e) {
                    console.error("IV generation error:", e);
                    showAlert('IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("IV generation failed");
                }
            }
            iv = safeBase64ToArrayBuffer(localStorage.getItem('currentIV'));

            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const result = await window.crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                },
                derivedKey,
                encodedData
            );

            const encryptedData = arrayBufferToSafeBase64(result);

            return encryptedData;

        } catch (error) {
            console.error("WebCrypto encryption error:", error);
            showAlert('Encryption Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto encryption failed: " + error.message);
        }
    }

    async function generateHmacWebCrypto(data, salt) {
        try {
            const secret = await getHmacSecret();
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign", "verify"]
            );

            const hmac = await window.crypto.subtle.sign(
                "HMAC",
                keyMaterial,
                new TextEncoder().encode(JSON.stringify(data))
            );

            return arrayBufferToSafeBase64(hmac);

        } catch (error) {
            console.error("WebCrypto HMAC generation error:", error);
            showAlert('HMAC Generation Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC generation failed: " + error.message);
        }
    }

    async function generateAndStoreHmacWebCrypto(data, salt) {
        try {
            const hmac = await generateHmacWebCrypto(data, salt);
            // No need to store HMAC in localStorage, as it's immediately used
            return hmac;
        } catch (e) {
            console.error("WebCrypto HMAC generation error", e);
            showAlert('HMAC Generation Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC generation failed");
        }
    }

    async function encryptHmacWebCrypto(hmac, salt) {
        try {
            const derivedKey = await deriveKeyMaterial(salt);
            let iv = localStorage.getItem('hmacIV');
            if (!iv){
                try {
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16));
                    iv = arrayBufferToSafeBase64(ivBuffer.buffer);
                    localStorage.setItem('hmacIV', iv);
                } catch (e) {
                    console.error("HMAC IV generation error:", e);
                    showAlert('HMAC IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("HMAC IV generation failed");
                }
            }
            iv = safeBase64ToArrayBuffer(localStorage.getItem('hmacIV'));

            const encodedHmac = new TextEncoder().encode(hmac);

            const encryptedHmacBuffer = await window.crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                },
                derivedKey,
                encodedHmac
            );

            return arrayBufferToSafeBase64(encryptedHmacBuffer);
        } catch (e) {
            console.error("WebCrypto HMAC encryption error:", e);
            showAlert('HMAC Encryption Failed. Secure login disabled.', 'error');
            throw new Error("WebCrypto HMAC encryption failed");
        }
    }

    // Schedule cleanup tasks.
    scheduleCleanupTasks();

    function scheduleCleanupTasks() {
        // Clear localStorage weekly at 6 AM every Sunday
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
        const millisTillNextSunday = (7 - dayOfWeek) % 7 * 24 * 60 * 60 * 1000 +
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0).getTime() -
            now.getTime();

        setTimeout(function() {
            clearEncryptionData();
            // Schedule the task to run every week (7 days)
            setInterval(clearEncryptionData, 7 * 24 * 60 * 60 * 1000);
        }, millisTillNextSunday);
    }

    function clearEncryptionData() {
        sessionStorage.removeItem('encryptionSalt');
        sessionStorage.removeItem('keyPrefix');
        sessionStorage.removeItem('ivPrefix');
        sessionStorage.removeItem('hmacSecret');
        localStorage.removeItem('currentIV');
        localStorage.removeItem('hmacIV');
        console.log('Encryption data cleared from localStorage.');
    }

    // Add check for window.crypto
    if (!window.crypto || !window.crypto.subtle) {
        console.error("Web Crypto API not supported!");
        showAlert("Web Crypto API not supported. Secure login disabled.", 'error');
        return;
    }

    // Check if running in a secure context (HTTPS)
    if (window.location.protocol !== 'https:') {
        console.warn("Website is not running on HTTPS. Encryption may not be fully secure.");
        showAlert("Website is not running on HTTPS. Encryption may not be fully secure.", 'warning');
    }

    // Implement timing attack resistant comparison
    function isEqual(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string') {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    }

    // Use more secure key derivation
    async function deriveKeyMaterial(salt) {
        const password = await generateKey(salt);

        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey", "deriveBits"]
        );

        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: enc.encode(salt),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        return key;
    }

    // Replace generateKey and generateIV with key derivation
    async function generateKey(salt) {
        if (!salt || typeof salt !== 'string') {
            console.error("Invalid salt:", salt);
            salt = 'default_salt';
        }
        const combined = salt + getKeyPrefix() + getIVPrefix();
        const encoder = new TextEncoder();
        const data = encoder.encode(combined);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Prevent form resubmission
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    // Function to hash the password using SHA-256
    async function hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error("Password hashing error:", error);
            showAlert('Password hashing failed. Secure login disabled.', 'error');
            throw new Error("Password hashing failed: " + error.message);
        }
    }

    // CSP Nonce Management
    function generateNonce() {
        const nonceBytes = new Uint8Array(16);
        window.crypto.getRandomValues(nonceBytes);
        return btoa(String.fromCharCode.apply(null, nonceBytes));
    }

    function setCSPHeaders(nonce) {
        const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';`;
        document.head.insertAdjacentHTML('beforeend', `<meta http-equiv="Content-Security-Policy" content="${csp}">`);
    }

    const nonce = generateNonce();
    setCSPHeaders(nonce);
    window.nonce = nonce;

    // Clear sensitive data on unload
    window.addEventListener('beforeunload', clearEncryptionData);

    // Add automatic logout after 30 minutes of inactivity
    let timeoutId;

    function resetTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
    }

    function logout() {
        // Redirect to the logout page or perform logout actions
        window.location.href = '/logout';
        showAlert('You have been logged out due to inactivity.', 'info');
    }

    // Start timeout counter on page load
    resetTimeout();

    // Reset timeout on any user activity
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keydown', resetTimeout);
    document.addEventListener('click', resetTimeout);

    // Check if the user has disabled localStorage
    function localStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    if (!localStorageAvailable()) {
        console.warn("Local Storage is disabled. Some security features may be affected.");
        showAlert("Local Storage is disabled. Some security features may be affected.", 'warning');
    }

    // Disable autocomplete on sensitive fields
    const usernameField = getElement('username');
    const passwordField = getElement('password');
    const captchaField = getElement('captcha');

    if (usernameField) {
        usernameField.autocomplete = 'off';
        usernameField.setAttribute("autocomplete", "disabled");
    }

    if (passwordField) {
        passwordField.autocomplete = 'new-password';
        passwordField.setAttribute("autocomplete", "disabled");
    }

    if (captchaField) {
        captchaField.autocomplete = 'off';
        captchaField.setAttribute("autocomplete", "disabled");
    }

    // Replace base64 with URL-safe base64
    function arrayBufferToSafeBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function safeBase64ToArrayBuffer(safeBase64) {
        const base64 = safeBase64.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - base64.length % 4) % 4);
        const base64Padded = base64 + padding;
        const binary_string = window.atob(base64Padded);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Prevent caching of login page
    preventPageCaching();

    function preventPageCaching() {
        // Disable browser caching on page load
        document.querySelector('body').classList.add('no-cache');

        // Set HTTP headers to prevent caching
        window.addEventListener('load', function() {
            // Overwrite HTTP headers to prevent caching
            const cacheControlMeta = querySelector('meta[http-equiv="Cache-Control"]');
            const pragmaMeta = querySelector('meta[http-equiv="Pragma"]');
            const expiresMeta = querySelector('meta[http-equiv="Expires"]');

            if (cacheControlMeta) {
                cacheControlMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
            } else {
                document.head.insertAdjacentHTML('beforeend', '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">');
            }

            if (pragmaMeta) {
                pragmaMeta.setAttribute('content', 'no-cache');
            } else {
                document.head.insertAdjacentHTML('beforeend', '<meta http-equiv="Pragma" content="no-cache">');
            }

            if (expiresMeta) {
                expiresMeta.setAttribute('content', '0');
            } else {
                document.head.insertAdjacentHTML('beforeend', '<meta http-equiv="Expires" content="0">');
            }
        });

        // Check if the page is loaded from the cache. If so, reload it.
        if (performance && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
            location.reload(true);
        }
    }

    // Check for secure random number generator
    function isSecureContext() {
        return window.isSecureContext;
    }

    if (!isSecureContext()) {
        console.warn("Insecure context! Some security features might be affected.");
        showAlert("Insecure context! Some security features might be affected.", 'warning');
    }
});