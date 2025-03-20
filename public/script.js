document.addEventListener('DOMContentLoaded', function() {
    // Function to generate a random encryption key (AES-256)
    function generateEncryptionKey() {
        const key = crypto.getRandomValues(new Uint8Array(32)); // 256 bits
        return Array.from(key).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Function to store the encryption key securely (e.g., in localStorage, encrypted)
    function storeEncryptionKey(key) {
        // This is a placeholder - in a real application, use a secure method
        // such as encrypting the key before storing it.  Consider using the Web Crypto API for encryption.
        localStorage.setItem('encryptionKey', key);
    }

    // Function to retrieve the encryption key
    function getEncryptionKey() {
        return localStorage.getItem('encryptionKey');
    }

    // Function to encrypt data using AES-256
    async function encryptData(data, keyHex) {
        const key = await crypto.subtle.importKey(
            "raw",
            hexToBytes(keyHex),
            "AES-CBC",
            false,
            ["encrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: iv
            },
            key,
            new TextEncoder().encode(data)
        );
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');

        return ivHex + encryptedHex; // Prepend IV for decryption
    }

    // Function to decrypt data using AES-256
    async function decryptData(encryptedData, keyHex) {
         const ivHex = encryptedData.slice(0, 32); // Extract IV (16 bytes * 2 hex chars)
         const encryptedHex = encryptedData.slice(32); // Extract encrypted data
         const iv = hexToBytes(ivHex);
         const encryptedBytes = hexToBytes(encryptedHex);

        const key = await crypto.subtle.importKey(
            "raw",
            hexToBytes(keyHex),
            "AES-CBC",
            false,
            ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: iv
            },
            key,
            encryptedBytes
        );

        return new TextDecoder().decode(decrypted);
    }

    // Helper function to convert hex string to byte array
    function hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return new Uint8Array(bytes);
    }

    // Example usage (for testing purposes, integrate with login/signup later)
    const generateKeyButton = document.createElement('button');
    generateKeyButton.textContent = 'Generate Encryption Key';
    generateKeyButton.style.position = 'absolute';
    generateKeyButton.style.top = '20px';
    generateKeyButton.style.left = '20px';
    document.body.appendChild(generateKeyButton);

    generateKeyButton.addEventListener('click', function() {
        const newKey = generateEncryptionKey();
        storeEncryptionKey(newKey);
        console.log('New encryption key generated and stored.');
    });

     const encryptionTestButton = document.createElement('button');
        encryptionTestButton.textContent = 'Test Encryption';
        encryptionTestButton.style.position = 'absolute';
        encryptionTestButton.style.top = '60px';
        encryptionTestButton.style.left = '20px';
        document.body.appendChild(encryptionTestButton);

        encryptionTestButton.addEventListener('click', async function() {
            const key = getEncryptionKey();
            if (!key) {
                console.error('No encryption key found. Generate one first.');
                return;
            }

            const testData = 'This is a secret message!';
            try {
                const encryptedData = await encryptData(testData, key);
                console.log('Encrypted Data:', encryptedData);

                const decryptedData = await decryptData(encryptedData, key);
                console.log('Decrypted Data:', decryptedData);

                if (testData === decryptedData) {
                    console.log('Encryption and decryption successful!');
                } else {
                    console.error('Encryption and decryption failed.');
                }
            } catch (error) {
                console.error('Encryption/decryption error:', error);
            }
        });
});