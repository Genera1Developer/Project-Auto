class Security {
    static generateSecureRandomString(length = 32) {
        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += validChars[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * validChars.length)];
        }
        return result;
    }

    static async hashString(message, salt) {
        const msgBuffer = new TextEncoder().encode(message + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    static async encryptWithAES(plainText, key) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);

        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            data
        );

        const encryptedArray = new Uint8Array(encrypted);
        const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
        combinedArray.set(iv, 0);
        combinedArray.set(encryptedArray, iv.length);

        return btoa(String.fromCharCode(...combinedArray));
    }

    static async decryptWithAES(cipherText, key) {
        const decodedData = atob(cipherText);
        const combinedArray = new Uint8Array(decodedData.length).map(x => decodedData.charCodeAt(x));
        const iv = combinedArray.slice(0, 12);
        const encryptedArray = combinedArray.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedArray
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }

    static async generateAESKey(keyMaterial) {
        const keyBytes = new TextEncoder().encode(keyMaterial);
        return await crypto.subtle.importKey(
            "raw",
            keyBytes,
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
    }
}

module.exports = Security;