class Bare {
    constructor(opts = {}) {
        this.origin = opts.origin || location.origin;
        this.pathname = opts.pathname || '/bare/';
        this.prefix = this.origin + this.pathname;
        this.encryptionEnabled = opts.encryptionEnabled || false;
        this.encryptionKey = opts.encryptionKey || null;
        this.integrityEnabled = opts.integrityEnabled || false;
        this.integrityType = opts.integrityType || 'SHA-256';
        this.integrityHeaderName = opts.integrityHeaderName || 'X-Content-Integrity';
        this.integrityCheckFailed = false;
        this.hkdfSalt = opts.hkdfSalt || 'salt';
        this.hkdfInfo = opts.hkdfInfo || '';
        this.encryptionAlgo = opts.encryptionAlgo || "AES-GCM";
        this.hkdfHash = opts.hkdfHash || "SHA-256";
        this.ivLength = opts.ivLength || 12;
    }

    async fetch(url, options = {}) {
        return this.#handleRequest(url, options, 'fetch');
    }

    async route(url, options = {}) {
        return this.#handleRequest(url, options, 'route');
    }

    async request(url, options = {}) {
        const response = await this.#handleRequest(url, options, 'request');
        try {
            return await response.json();
        } catch (error) {
            console.error("Bare request JSON parse error:", error);
            throw new Error("Failed to parse JSON response.");
        }
    }

    createProxy(url) {
        if (this.encryptionEnabled && this.encryptionKey) {
            try {
                const encryptedUrl = this.encrypt(url, this.encryptionKey);
                return this.prefix + encodeURIComponent(encryptedUrl);
            } catch (error) {
                console.error("Encryption failed:", error);
                return this.prefix + encodeURIComponent(url); // Return unencrypted URL if encryption fails.
            }
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

        if (!key) {
            console.warn("Encryption key is not provided. Encryption will not be enabled.");
            return plainText;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(plainText);
            const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLength)); // Recommended IV length for AES-GCM

            // Derive encryption key using HKDF
            const derivedKey = await this.#deriveKey(key);

            const cipherTextBuffer = await window.crypto.subtle.encrypt(
                { name: this.encryptionAlgo, iv: iv },
                derivedKey,
                data
            );

            const cipherText = new Uint8Array(cipherTextBuffer);
            const combined = new Uint8Array(iv.length + cipherText.length);
            combined.set(iv, 0);
            combined.set(cipherText, iv.length);

            return btoa(String.fromCharCode(...combined));


        } catch (error) {
            console.error("Encryption error:", error);
            throw new Error("Encryption Failed");
        }
    }

    async decrypt(cipherText, key) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Web Crypto API is not supported in this browser. Decryption will not be enabled.");
            return cipherText;
        }

        if (!key) {
             console.warn("Decryption key is not provided. Decryption will not be enabled.");
            return cipherText;
        }
        try {
            const decoder = new TextDecoder();
            const decodedData = atob(cipherText);
            const combined = new Uint8Array(decodedData.length).map(x => decodedData.charCodeAt(x));
            const iv = combined.slice(0, this.ivLength);
            const cipherTextBytes = combined.slice(this.ivLength);

            // Derive decryption key using HKDF
            const derivedKey = await this.#deriveKey(key);

            const plainTextBuffer = await window.crypto.subtle.decrypt(
                { name: this.encryptionAlgo, iv: iv },
                derivedKey,
                cipherTextBytes
            );

            const plainText = decoder.decode(plainTextBuffer);
            return plainText;

        } catch (error) {
            console.error("Decryption error:", error);
            throw new Error("Decryption Failed");
        }
    }

    async calculateIntegrity(data, type = 'SHA-256') {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Web Crypto API is not supported in this browser. Integrity checks will not be enabled.");
            return null;
        }

        const encoder = new TextEncoder();
        const buffer = encoder.encode(data);

        try {
            const hashBuffer = await window.crypto.subtle.digest(type, buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error("Integrity calculation error:", error);
            return null;
        }
    }

    async #deriveKey(key) {
        const encoder = new TextEncoder();
        const salt = encoder.encode(this.hkdfSalt);
        const info = encoder.encode(this.hkdfInfo);
        try {
            const baseKey = await window.crypto.subtle.importKey(
                "raw",
                encoder.encode(key),
                { name: "HKDF" },
                false,
                ["deriveKey", "deriveBits"]
            );

            const derivedKey = await window.crypto.subtle.deriveKey(
                { name: "HKDF", hash: this.hkdfHash, salt: salt, info: info },
                baseKey,
                { name: this.encryptionAlgo, length: 256 },
                false,
                ["encrypt", "decrypt"]
            );
            return derivedKey;
        } catch (error) {
            console.error("HKDF key derivation error:", error);
            throw new Error("HKDF Key Derivation Failed");
        }
    }


    async #handleRequest(url, options = {}, method) {
        let fetchUrl = this.prefix + encodeURIComponent(url);
        let originalURL = url;

        if (this.encryptionEnabled && this.encryptionKey) {
            try {
                const encryptedUrl = await this.encrypt(url, this.encryptionKey);
                fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
            } catch (error) {
                console.error("Encryption failed:", error);
                throw new Error("Failed to encrypt URL.");
            }
        }

        let response = null;
        try {
            response = await fetch(fetchUrl, options);
        } catch (error) {
            console.error(`Bare ${method} fetch error:`, error);
            throw new Error(`Bare ${method} fetch error: ${error.message}`);
        }

        if (!response.ok) {
            const errorType = `Bare ${method} error`;
            console.error(`${errorType}: HTTP error! status: ${response.status} - ${fetchUrl}`);
            throw new Error(`${errorType}: HTTP error! status: ${response.status}`);
        }

        let responseText = null;
        if (this.integrityEnabled) {
            const expectedIntegrity = response.headers.get(this.integrityHeaderName);
            if (expectedIntegrity) {
                responseText = await response.clone().text();
                const integrity = await this.calculateIntegrity(responseText, this.integrityType);

                if (integrity !== expectedIntegrity) {
                    console.error(`Bare ${method} error: Content integrity check failed.`);
                    this.integrityCheckFailed = true;
                    throw new Error(`Bare ${method} error: Content integrity check failed.`);
                }
                this.integrityCheckFailed = false;
            } else {
                console.warn(`Integrity check enabled but ${this.integrityHeaderName} header not found.`);
            }
        }

        if (this.encryptionEnabled && this.encryptionKey) {
            try {
                if(!responseText) {
                    responseText = await response.clone().text();
                }
                const decryptedText = await this.decrypt(responseText, this.encryptionKey);

                const decryptedResponse = new Response(decryptedText, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
                return decryptedResponse;
            } catch (error) {
                console.error("Decryption of response failed:", error);
                throw new Error("Failed to decrypt response.");
            }
        }

        return response;
    }
}