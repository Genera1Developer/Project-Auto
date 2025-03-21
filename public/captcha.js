document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');
    let generatedCaptcha = '';
    let encryptionKey = '';
    let encryptionIV = '';
    let salt = '';

    function generateEncryptionKeys() {
        const keyArray = new Uint8Array(16);
        const ivArray = new Uint8Array(16);
        const saltArray = new Uint8Array(16);
        window.crypto.getRandomValues(keyArray);
        window.crypto.getRandomValues(ivArray);
        window.crypto.getRandomValues(saltArray);

        encryptionKey = Array.from(keyArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
        encryptionIV = Array.from(ivArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
        salt = Array.from(saltArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        generatedCaptcha = captcha;
        return captcha;
    }

    async function encryptCaptcha(captcha, key, iv) {
        try {
            const parsedKey = CryptoJS.enc.Hex.parse(key);
            const parsedIv = CryptoJS.enc.Hex.parse(iv);
            const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(captcha), parsedKey, {
                iv: parsedIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        } catch (error) {
            console.error("Encryption error:", error);
            return null;
        }
    }

    async function displayEncryptedCaptcha() {
        generateEncryptionKeys();
        const captcha = generateCaptcha();
        const encryptedCaptcha = await encryptCaptcha(captcha, encryptionKey, encryptionIV);
         if (encryptedCaptcha === null) {
            errorMessageElement.textContent = 'Encryption failed. Refresh.';
            errorMessageElement.style.color = 'red';
            return;
        }
        captchaTextElement.textContent = encryptedCaptcha;

        const dataToStore = {
            encryptionKey: encryptionKey,
            encryptionIV: encryptionIV,
            salt: salt,
            encryptedCaptcha: encryptedCaptcha,
        };

        const compositeKey = CryptoJS.SHA256(encryptionKey + salt).toString();
        const storageKey = compositeKey.substring(0, 32);
        const storageIv = CryptoJS.MD5(encryptionIV + salt).toString().substring(0, 16);

        const encryptedStorage = CryptoJS.AES.encrypt(JSON.stringify(dataToStore), CryptoJS.enc.Hex.parse(storageKey),{
            iv: CryptoJS.enc.Hex.parse(storageIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        sessionStorage.setItem('encryptedData', encryptedStorage);
    }

    window.validateCaptcha = async function() {
        const userInput = captchaInputElement.value;
        const encryptedData = sessionStorage.getItem('encryptedData');

        if (!encryptedData) {
            errorMessageElement.textContent = 'Encryption keys missing. Refresh.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha();
            captchaInputElement.value = '';
            return;
        }

         try {
            const compositeKey = CryptoJS.SHA256(encryptionKey + salt).toString();
            const storageKey = compositeKey.substring(0, 32);
            const storageIv = CryptoJS.MD5(encryptionIV + salt).toString().substring(0, 16);

            const decryptedStorage = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(storageKey),{
                iv: CryptoJS.enc.Hex.parse(storageIv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);

            const storedData = JSON.parse(decryptedStorage);
            const storedKey = storedData.encryptionKey;
            const storedIV = storedData.encryptionIV;
            const storedSalt = storedData.salt;
            const storedEncryptedCaptcha = storedData.encryptedCaptcha;

            const encryptedUserInput = await encryptCaptcha(userInput, storedKey, storedIV);
             if (encryptedUserInput === null) {
                errorMessageElement.textContent = 'Encryption failed. Please try again.';
                errorMessageElement.style.color = 'red';
                displayEncryptedCaptcha();
                captchaInputElement.value = '';
                return;
            }

           if (encryptedUserInput === storedEncryptedCaptcha) {
                 errorMessageElement.textContent = 'Captcha verified!';
                 errorMessageElement.style.color = 'green';
            } else {
                errorMessageElement.textContent = 'Incorrect captcha. Please try again.';
                errorMessageElement.style.color = 'red';

                displayEncryptedCaptcha();
                captchaInputElement.value = '';
            }


        } catch (error) {
            errorMessageElement.textContent = 'Decryption error.  Double check.';
            errorMessageElement.style.color = 'red';
            displayEncryptedCaptcha();
            captchaInputElement.value = '';
        }
    };

    displayEncryptedCaptcha();
});