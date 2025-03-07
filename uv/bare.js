class Bare {
    constructor(opts = {}) {
        this.origin = opts.origin || location.origin;
        this.pathname = opts.pathname || '/bare/';
        this.prefix = this.origin + this.pathname;
        this.encryptionEnabled = opts.encryptionEnabled || false;
        this.encryptionKey = opts.encryptionKey || null;
    }

    async fetch(url, options = {}) {
        let fetchUrl = this.prefix + encodeURIComponent(url);

        if (this.encryptionEnabled && this.encryptionKey) {
            const encryptedUrl = await this.encrypt(url, this.encryptionKey);
            fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
        }

        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare fetch error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare fetch error: HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error("Bare fetch error:", error);
            throw error;
        }
    }

    async route(url, options = {}) {
        let fetchUrl = this.prefix + encodeURIComponent(url);
        if (this.encryptionEnabled && this.encryptionKey) {
            const encryptedUrl = await this.encrypt(url, this.encryptionKey);
            fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
        }
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare route error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare route error: HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error("Bare route error:", error);
            throw error;
        }
    }

    async request(url, options = {}) {
        let fetchUrl = this.prefix + encodeURIComponent(url);
        if (this.encryptionEnabled && this.encryptionKey) {
            const encryptedUrl = await this.encrypt(url, this.encryptionKey);
            fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
        }
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare request error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare request error: HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Bare request error:", error);
            throw error;
        }
    }

    createProxy(url) {
        if (this.encryptionEnabled && this.encryptionKey) {
            const encryptedUrl = this.encrypt(url, this.encryptionKey); //Don't await
            return this.prefix + encodeURIComponent(encryptedUrl);
        }
        return this.prefix + encodeURIComponent(url);
    }

	/**
	 * Resolves a URL to an absolute URL.
	 * @param {string} url The URL to resolve.
	 * @param {string} base The base URL to resolve against.
	 * @returns {string} The absolute URL.
	 */
	resolve(url, base) {
		try {
			return new URL(url, base || this.origin).href;
		} catch (error) {
			console.warn("Bare resolve error:", error, url, base);
			return;
		}
	}

    async encrypt(plainText, key) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Web Crypto API is not supported in this browser. Encryption will not be enabled.");
            return plainText;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Recommended IV length for AES-GCM

        try {
            const importedKey = await window.crypto.subtle.importKey(
                "raw",
                encoder.encode(key),
                { name: "AES-GCM", length: 256 }, // Specify key length
                false,
                ["encrypt", "decrypt"]
            );

            const cipherTextBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                importedKey,
                data
            );

            const cipherText = new Uint8Array(cipherTextBuffer);
            const combined = new Uint8Array(iv.length + cipherText.length);
            combined.set(iv, 0);
            combined.set(cipherText, iv.length);

            return btoa(String.fromCharCode(...combined));


        } catch (error) {
            console.error("Encryption error:", error);
            return plainText;
        }
    }

    async decrypt(cipherText, key) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Web Crypto API is not supported in this browser. Decryption will not be enabled.");
            return cipherText;
        }

        const decoder = new TextDecoder();
        const decodedData = atob(cipherText);
        const combined = new Uint8Array(decodedData.length).map(x => decodedData.charCodeAt(x));
        const iv = combined.slice(0, 12);
        const cipherTextBytes = combined.slice(12);


        try {
            const encoder = new TextEncoder();
            const importedKey = await window.crypto.subtle.importKey(
                "raw",
                encoder.encode(key),
                { name: "AES-GCM", length: 256 }, // Specify key length
                false,
                ["encrypt", "decrypt"]
            );

            const plainTextBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                importedKey,
                cipherTextBytes
            );

            const plainText = decoder.decode(plainTextBuffer);
            return plainText;

        } catch (error) {
            console.error("Decryption error:", error);
            return cipherText;
        }
    }
}