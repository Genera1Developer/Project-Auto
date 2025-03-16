document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            return;
        }

        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const encryptedData = await response.text();

            // Decrypt the data in the browser
            const encryptionKey = 'defaultEncryptionKey'; //TODO: replace with secure key exchange
            const decryptedData = decrypt(encryptedData, encryptionKey);

            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching or decrypting data:', error);
            contentDiv.textContent = `Error: ${error.message}`;
        }
    });

    function decrypt(text, key) {
        const textParts = text.split(':');
        const iv = textParts.shift();
		const authTag = textParts.shift();
        const encryptedText = textParts.join(':');

        const ivBuffer = Buffer.from(iv, 'hex');
		const authTagBuffer = Buffer.from(authTag, 'hex');
        const encryptedTextBuffer = Buffer.from(encryptedText, 'hex');
		const keyBuffer = Buffer.from(key);

        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
			decipher.setAuthTag(authTagBuffer);
            let decrypted = decipher.update(encryptedTextBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error("Decryption error:", error);
            return "Decryption failed: " + error.message;
        }
    }

});

edit filepath: uv/buffer.js
content: // buffer.js - Polyfill for Buffer in Ultraviolet

// A simple buffer implementation for demonstration purposes.
// In a real-world scenario, you'd likely use a more complete
// and optimized Buffer implementation.

class Buffer {
  constructor(array) {
    this.data = new Uint8Array(array);
    this.length = this.data.length;
  }

  static from(obj, encoding) {
    if (typeof obj === 'string') {
      encoding = encoding || 'utf-8';
      let array;
      if (encoding === 'utf-8') {
        array = new TextEncoder().encode(obj);
      } else {
        throw new Error('Unsupported encoding: ' + encoding);
      }
      return new Buffer(array);
    } else if (Array.isArray(obj)) {
      return new Buffer(obj);
    } else if (obj instanceof ArrayBuffer) {
      return new Buffer(new Uint8Array(obj));
    } else if (obj instanceof Uint8Array) {
      return new Buffer(obj);
    }
    throw new Error('Unsupported argument type for Buffer.from()');
  }

  toString(encoding) {
    encoding = encoding || 'utf-8';
    if (encoding === 'utf-8') {
      return new TextDecoder().decode(this.data);
    } else {
      throw new Error('Unsupported encoding: ' + encoding);
    }
  }

  toArray() {
    return Array.from(this.data);
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }
}

// Export the Buffer class
globalThis.Buffer = Buffer;
edit filepath: uv/crypto.js
content: // crypto.js - Placeholder for crypto functionality

// Placeholder implementation for crypto functions used in proxy.js.
// Replace with a real crypto library or polyfill for production use.

const crypto = {
    randomBytes: (size) => {
        const array = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = Math.floor(Math.random() * 256); // Simulate random byte generation
        }
        return array;
    },
    createCipheriv: (algorithm, key, iv) => {
        // Dummy cipher object
        return {
            update: (data) => data,
            final: () => new Uint8Array(0),
			getAuthTag: () => crypto.randomBytes(16),
			setAuthTag: (tag) => {},
        };
    },
    createDecipheriv: (algorithm, key, iv) => {
        // Dummy decipher object
        return {
            update: (data) => data,
            final: () => new Uint8Array(0),
			setAuthTag: (tag) => {},
        };
    },
};

globalThis.crypto = crypto;