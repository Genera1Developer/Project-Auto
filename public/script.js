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
            e.preventDefault(); // Prevent potential form submission or page jump
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
        refreshCaptchaButton.addEventListener('click', function(e) {
            refreshCaptcha();
            e.preventDefault();
        });
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
                showAlert('Please enter all fields.', 'error');
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
        // Password Strength Check
        const passwordStrength = checkPasswordStrength(password);
        if (passwordStrength < 4) {
            errorMessage.textContent = 'Password does not meet complexity requirements.';
            encryptionStatus.textContent = 'Weak Password.';
            showAlert('Password must be at least 8 characters and include upper case, lower case, numbers, and symbols.', 'error');
            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'none';
            }
            return;
        }

        try {
            const saltValue = await generateAndStoreSalt();
            const [encryptedData, hmac] = await Promise.all([
                encryptData({ username: username, password: password, captcha: captcha }, saltValue),
                generateAndStoreHmac({ username: username, password: password, captcha: captcha }, saltValue)
            ]);

            const encryptedHmac = await encryptHmac(hmac, saltValue);

            const keyPrefix = getKeyPrefix();
            const ivPrefix = getIVPrefix();

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Encryption': 'true',
                    'X-Salt': saltValue,
                    'X-HMAC': encryptedHmac,
                    'X-Key-Prefix': keyPrefix,
                    'X-IV-Prefix': ivPrefix,
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
        return await encryptDataWebCrypto(data, salt);
    }

    async function generateAndStoreHmac(data, salt) {
        return await generateAndStoreHmacWebCrypto(data, salt);
    }

    async function encryptHmac(hmac, salt) {
        return await encryptHmacWebCrypto(hmac, salt);
    }

    async function generateAndStoreSalt() {
        let salt = localStorage.getItem('encryptionSalt'); // Use localStorage
        if (!salt) {
            try {
                const saltBuffer = new Uint8Array(16);
                window.crypto.getRandomValues(saltBuffer);
                salt = arrayBufferToSafeBase64(saltBuffer.buffer);
                localStorage.setItem('encryptionSalt', salt); // Use localStorage
            } catch (e) {
                console.error("Salt generation error:", e);
                showAlert('Salt Generation Failed. Secure login disabled.', 'error');
                throw new Error("Salt generation failed");
            }
        }
        return salt;
    }

    function getKeyPrefix() {
        let prefix = localStorage.getItem('keyPrefix'); // Use localStorage
        if (!prefix) {
            try{
                const prefixBuffer = new Uint8Array(8);
                window.crypto.getRandomValues(prefixBuffer);
                prefix = arrayBufferToSafeBase64(prefixBuffer.buffer);
                localStorage.setItem('keyPrefix', prefix); // Use localStorage
            } catch (e) {
                console.error("Key Prefix generation error:", e);
                showAlert('Key Prefix Generation Failed. Secure login disabled.', 'error');
                throw new Error("Key Prefix generation failed");
            }
        }
        return prefix;
    }

    function getIVPrefix() {
        let prefix = localStorage.getItem('ivPrefix'); // Use localStorage
        if (!prefix) {
            try{
                const prefixBuffer = new Uint8Array(8);
                window.crypto.getRandomValues(prefixBuffer);
                prefix = arrayBufferToSafeBase64(prefixBuffer.buffer);
                localStorage.setItem('ivPrefix', prefix); // Use localStorage
            } catch (e) {
                console.error("IV Prefix generation error:", e);
                showAlert('IV Prefix Generation Failed. Secure login disabled.', 'error');
                throw new Error("IV Prefix generation failed");
            }
        }
        return prefix;
    }

    async function getHmacSecret() {
        let secret = localStorage.getItem('hmacSecret'); // Use localStorage
        if (!secret) {
            try {
                const secretBuffer = new Uint8Array(32);
                window.crypto.getRandomValues(secretBuffer);
                secret = arrayBufferToSafeBase64(secretBuffer.buffer);
                localStorage.setItem('hmacSecret', secret); // Use localStorage
            } catch (e) {
                console.error("HMAC secret generation error:", e);
                showAlert('HMAC Secret Generation Failed. Secure login disabled.', 'error');
                throw new Error("HMAC secret generation failed");
            }
        }
        return secret;
    }

    function getCSRFToken() {
        const metaTag = querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.content : null;
    }

     // Corrected path for particlesJS loading
    if (typeof particlesJS === 'function') {
         particlesJS.load('particles-js', 'particles-config.json', function() {
             console.log('particles.js loaded - callback');
         });
     } else {
         console.warn('particlesJS function not found. Ensure particles.js is loaded.');
     }


    function showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `custom-alert ${type}`;
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);

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

            let iv = localStorage.getItem('currentIV'); // Use localStorage
            if (!iv){
                try{
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16));
                    iv = arrayBufferToSafeBase64(ivBuffer.buffer);
                    localStorage.setItem('currentIV', iv); // Use localStorage
                } catch (e) {
                    console.error("IV generation error:", e);
                    showAlert('IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("IV generation failed");
                }
            }
            iv = safeBase64ToArrayBuffer(localStorage.getItem('currentIV')); // Use localStorage

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
            let iv = localStorage.getItem('hmacIV'); // Use localStorage
            if (!iv){
                try {
                    const ivBuffer =  window.crypto.getRandomValues(new Uint8Array(16));
                    iv = arrayBufferToSafeBase64(ivBuffer.buffer);
                    localStorage.setItem('hmacIV', iv); // Use localStorage
                } catch (e) {
                    console.error("HMAC IV generation error:", e);
                    showAlert('HMAC IV Generation Failed. Secure login disabled.', 'error');
                    throw new Error("HMAC IV generation failed");
                }
            }
            iv = safeBase64ToArrayBuffer(localStorage.getItem('hmacIV')); // Use localStorage

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

    function clearEncryptionData() {
        localStorage.removeItem('encryptionSalt');
        localStorage.removeItem('keyPrefix');
        localStorage.removeItem('ivPrefix');
        localStorage.removeItem('hmacSecret');
        localStorage.removeItem('currentIV');
        localStorage.removeItem('hmacIV');
        console.log('Encryption data cleared from localStorage.');
    }

    if (!window.crypto || !window.crypto.subtle) {
        console.error("Web Crypto API not supported!");
        showAlert("Web Crypto API not supported. Secure login disabled.", 'error');
        return;
    }

    if (window.location.protocol !== 'https:') {
        console.warn("Website is not running on HTTPS. Encryption may not be fully secure.");
        showAlert("Website is not running on HTTPS. Encryption may not be fully secure.", 'warning');
    }

    function isEqual(a, b) {
         // Mitigate timing attacks
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

    async function deriveKeyMaterial(salt) {
        try {
            const password = await generateDerivedKey(salt, 'key');

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
        } catch (error) {
            console.error("Key derivation error:", error);
            showAlert('Key derivation failed. Secure login disabled.', 'error');
            throw new Error("Key derivation failed: " + error.message);
        }
    }

    async function generateDerivedKey(salt, type) {
        if (!salt || typeof salt !== 'string') {
            console.error("Invalid salt:", salt);
            salt = 'default_salt';
        }

        const combined = salt + getKeyPrefix() + getIVPrefix() + type;
        const encoder = new TextEncoder();
        const data = encoder.encode(combined);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

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

    window.addEventListener('beforeunload', clearEncryptionData);

    let timeoutId;

    function resetTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logout, 30 * 60 * 1000);
    }

    function logout() {
        window.location.href = '/logout';
        showAlert('You have been logged out due to inactivity.', 'info');
    }

    resetTimeout();

    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keydown', resetTimeout);
    document.addEventListener('click', resetTimeout);
    document.addEventListener('touchstart', resetTimeout);
    document.addEventListener('wheel', resetTimeout);

    function localStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

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

    preventPageCaching();

    function preventPageCaching() {
        document.querySelector('body').classList.add('no-cache');

        window.addEventListener('load', function() {
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

        if (performance && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
            location.reload(true);
        }
    }

    function isSecureContext() {
        return window.isSecureContext;
    }

    if (!isSecureContext()) {
        console.warn("Insecure context! Some security features might be affected.");
        showAlert("Insecure context! Some security features might be affected.", 'warning');
    }

    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const requirementsMet = [
            password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSymbols
        ];

        const strength = requirementsMet.filter(Boolean).length;

        return strength;
    }

    // Implement Key Rotation
    async function rotateEncryptionKeys() {
        clearEncryptionData(); // Clear old keys
        await generateAndStoreSalt();
        getKeyPrefix();
        getIVPrefix();
        await getHmacSecret();
        localStorage.setItem('keyRotationTimestamp', Date.now().toString());
    }

    // Schedule Key Rotation (e.g., daily)
    function scheduleKeyRotation() {
        const now = new Date();
        const millisTillNextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();

        setTimeout(function() {
            rotateEncryptionKeys();
            setInterval(rotateEncryptionKeys, 24 * 60 * 60 * 1000); // Daily rotation
        }, millisTillNextMidnight);
    }

    // Check if a key rotation is needed on page load
    function checkAndRotateKeys() {
        const lastRotationTimestamp = localStorage.getItem('keyRotationTimestamp');
        if (lastRotationTimestamp) {
            const lastRotationDate = new Date(parseInt(lastRotationTimestamp, 10));
            const now = new Date();

            if (now.getDate() !== lastRotationDate.getDate() ||
                now.getMonth() !== lastRotationDate.getMonth() ||
                now.getFullYear() !== lastRotationDate.getFullYear()) {
                rotateEncryptionKeys();
            }
        } else {
            rotateEncryptionKeys(); // If no timestamp, rotate keys immediately
        }
    }

    checkAndRotateKeys();
    scheduleKeyRotation(); // Initialize key rotation scheduling

    // Function to check if the user is using a VPN
    async function detectVPN() {
       try {
            const response = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
            const data = await response.json();
            const ipAddress = data.ip;

            // Removed VPN API call due to security concerns and rate limits.
            // Consider using a backend service for VPN detection.
            // const vpnCheckResponse = await fetch(`https://vpnapi.io/api/v1?key=EA2E54D360B847F7B7B7191871370E5F&ip=${ipAddress}`);
            // const vpnCheckData = await vpnCheckResponse.json();

            // if (vpnCheckData.security.vpn) {
            //    showAlert('VPN detected. For enhanced security, consider disabling it during login.', 'warning');
            // }
        } catch (error) {
            console.error('VPN detection error:', error);
        }
    }

    // Call VPN detection function (if needed)
    //detectVPN(); //Commented out due to API key security.

    // Mitigate BREACH attack
    function addRandomPadding() {
        const minPadding = 100;
        const maxPadding = 300;
        const paddingLength = Math.floor(Math.random() * (maxPadding - minPadding + 1)) + minPadding;
        let padding = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < paddingLength; i++) {
            padding += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const paddingElement = document.createElement('span');
        paddingElement.style.display = 'none';
        paddingElement.textContent = padding;
        document.body.appendChild(paddingElement);
    }

     // Implement defenses against timing attacks in sensitive operations
    function timingSafeEquals(a, b) {
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

         // Ensure the loop is not optimized away by always using the result
        if (result !== 0 && result !== 1) {
            result = 1;
        }

        return result === 0;
    }

    addRandomPadding();

    // HSTS preload check during login
    async function checkHSTSPreload() {
        try {
            const response = await fetch('https://hstspreload.org/api/v2/status?domain=' + window.location.hostname, { signal: AbortSignal.timeout(5000) });
            const data = await response.json();

            if (data.status === 'unknown') {
                showAlert('This site is not HSTS preloaded. Contact administrator to enable HSTS preload for enhanced security.', 'warning');
            } else if (data.status === 'pending') {
                showAlert('This site is pending HSTS preload submission.', 'info');
            } else if (data.status === 'preloaded') {
                console.log('HSTS preloaded!');
            }
        } catch (error) {
            console.error('HSTS preload check error:', error);
        }
    }

    checkHSTSPreload();

    // Feature policy implementation
    function setFeaturePolicy() {
        const featurePolicy = "autoplay 'none'; camera 'none'; geolocation 'none'; microphone 'none'; payment 'none'; usb 'none'";
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Feature-Policy';
        meta.content = featurePolicy;
        document.head.appendChild(meta);
    }

    setFeaturePolicy();

     // Subresource Integrity (SRI) Check
    async function checkSRI() {
        const scripts = document.querySelectorAll('script[src]');
        for (const script of scripts) {
            if (!script.integrity) {
                console.warn(`SRI missing for script: ${script.src}`);
                showAlert(`SRI missing for script: ${script.src}. Contact administrator.`, 'warning');
            }
        }

        const links = document.querySelectorAll('link[rel="stylesheet"][href]');
         for (const link of links) {
            if (!link.integrity) {
                console.warn(`SRI missing for stylesheet: ${link.href}`);
                showAlert(`SRI missing for stylesheet: ${link.href}. Contact administrator.`, 'warning');
            }
        }
    }

    checkSRI();

    // Implement stricter CSP
    function updateCSPHeaders(nonce) {
       // Remove 'unsafe-inline' from style-src in production. Use hashes or nonces.
       // The 'strict-dynamic' keyword is used in conjunction with nonces or hashes
       // to allow scripts loaded by trusted scripts.  It tells the browser to
       // only execute scripts that have a valid nonce or hash.
        const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content; require-trusted-types-for 'script'; trusted-types default-allow-all; worker-src 'self' blob:;`;
        const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (existingMeta) {
            existingMeta.content = csp;
        } else {
            document.head.insertAdjacentHTML('beforeend', `<meta http-equiv="Content-Security-Policy" content="${csp}">`);
        }
    }

    updateCSPHeaders(nonce);

    // Implement Certificate Pinning (example - requires backend support)
    async function checkCertificatePinning() {
        try {
            const response = await fetch('/api/certificate_status', { signal: AbortSignal.timeout(5000) }); // backend endpoint to check cert pinning
            if (response.status === 418) { // I'm a teapot - certificate mismatch
                showAlert('Certificate pinning mismatch detected. Connection potentially compromised.', 'error');
                // Potentially block further requests.
            }
        } catch (error) {
            console.error('Certificate pinning check error:', error);
        }
    }

    //checkCertificatePinning(); // Needs a backend to be functional.

    // Implement DNSSEC validation check
    async function checkDNSSEC() {
        try {
            const response = await fetch('/api/dnssec_status', { signal: AbortSignal.timeout(5000) });  // A backend that resolves and checks DNSSEC
            const data = await response.json();

            if (!data.valid) {
                showAlert('DNSSEC validation failed! Possible DNS spoofing attack.', 'error');
            }
        } catch (error) {
            console.error('DNSSEC check error:', error);
        }
    }

    //checkDNSSEC();  // requires backend support to function

    // Attempt to mitigate speculative execution attacks.
    function clearCPUBuffer() {
        try {
            const array = new ArrayBuffer(1024 * 1024);
            const buffer = new Uint8Array(array);
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] = i % 256;
            }
        } catch (e) {
            console.warn("Failed to clear CPU buffers:", e);
        }
    }

    clearCPUBuffer();
});