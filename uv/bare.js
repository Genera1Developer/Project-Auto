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
    }

    async fetch(url, options = {}) {
        let fetchUrl = this.prefix + encodeURIComponent(url);

        if (this.encryptionEnabled && this.encryptionKey) {
            try {
                const encryptedUrl = await this.encrypt(url, this.encryptionKey);
                fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
            } catch (error) {
                console.error("Encryption failed:", error);
                throw new Error("Failed to encrypt URL.");
            }
        }

        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare fetch error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare fetch error: HTTP error! status: ${response.status}`);
            }

            if (this.integrityEnabled) {
                const expectedIntegrity = response.headers.get(this.integrityHeaderName);
                if (expectedIntegrity) {
                    const text = await response.clone().text();
                    const integrity = await this.calculateIntegrity(text, this.integrityType);

                    if (integrity !== expectedIntegrity) {
                        console.error("Bare fetch error: Content integrity check failed.");
                        throw new Error("Bare fetch error: Content integrity check failed.");
                    }
                    return response;
                } else {
                    console.warn(`Integrity check enabled but ${this.integrityHeaderName} header not found.`);
                }
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
            try {
                const encryptedUrl = await this.encrypt(url, this.encryptionKey);
                fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
            } catch (error) {
                console.error("Encryption failed:", error);
                throw new Error("Failed to encrypt URL.");
            }
        }
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare route error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare route error: HTTP error! status: ${response.status}`);
            }

            if (this.integrityEnabled) {
                const expectedIntegrity = response.headers.get(this.integrityHeaderName);
                if (expectedIntegrity) {
                    const text = await response.clone().text();
                    const integrity = await this.calculateIntegrity(text, this.integrityType);

                    if (integrity !== expectedIntegrity) {
                        console.error("Bare route error: Content integrity check failed.");
                        throw new Error("Bare route error: Content integrity check failed.");
                    }
                    return response;
                } else {
                    console.warn(`Integrity check enabled but ${this.integrityHeaderName} header not found.`);
                }
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
            try {
                const encryptedUrl = await this.encrypt(url, this.encryptionKey);
                fetchUrl = this.prefix + encodeURIComponent(encryptedUrl);
            } catch (error) {
                console.error("Encryption failed:", error);
                throw new Error("Failed to encrypt URL.");
            }
        }
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                console.error(`Bare request error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare request error: HTTP error! status: ${response.status}`);
            }

            if (this.integrityEnabled) {
                const expectedIntegrity = response.headers.get(this.integrityHeaderName);
                if (expectedIntegrity) {
                    const text = await response.clone().text();
                    const integrity = await this.calculateIntegrity(text, this.integrityType);

                    if (integrity !== expectedIntegrity) {
                        console.error("Bare request error: Content integrity check failed.");
                        throw new Error("Bare request error: Content integrity check failed.");
                    }
                } else {
                    console.warn(`Integrity check enabled but ${this.integrityHeaderName} header not found.`);
                }
            }
            return await response.json();
        } catch (error) {
            console.error("Bare request error:", error);
            throw error;
        }
    }

    createProxy(url) {
        if (this.encryptionEnabled && this.encryptionKey) {
            try {
                const encryptedUrl = this.encrypt(url, this.encryptionKey); //Don't await
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
            const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Recommended IV length for AES-GCM

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
            const iv = combined.slice(0, 12);
            const cipherTextBytes = combined.slice(12);


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
}