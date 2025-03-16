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
            const decryptionKey = 'defaultEncryptionKey';

            // Decrypt the data on the client-side
            const decryptedData = decrypt(encryptedData, decryptionKey);

            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching or decrypting:', error);
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
    
        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), ivBuffer);
			decipher.setAuthTag(authTagBuffer);
            let decrypted = decipher.update(encryptedTextBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error("Decryption error:", error);
            return 'Decryption Failed';
        }
    }
});
edit filepath: uv/buffer.js
content: // buffer.js - Polyfill for Buffer (needed for browser compatibility)

(function() {
  if (typeof window === 'undefined') {
    return; // Skip if not in a browser environment
  }

  if (window.Buffer) {
    return; // Buffer is already defined
  }

  // Implement a basic Buffer polyfill
  window.Buffer = class Buffer {
    constructor(arg, encodingOrOffset, length) {
      if (typeof arg === 'number') {
        this.data = new Uint8Array(arg);
      } else if (Array.isArray(arg)) {
        this.data = new Uint8Array(arg);
      } else if (typeof arg === 'string') {
        this.data = new TextEncoder().encode(arg);
      } else if (arg instanceof ArrayBuffer) {
        this.data = new Uint8Array(arg);
      } else if (arg instanceof Uint8Array) {
        this.data = new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength);
      } else {
        this.data = new Uint8Array(0);
      }
    }

    static from(arg, encodingOrOffset, length) {
      return new Buffer(arg, encodingOrOffset, length);
    }

    toString(encoding) {
      return new TextDecoder(encoding).decode(this.data);
    }

    write(string, offset, length, encoding) {
      const encoder = new TextEncoder(encoding);
      const encoded = encoder.encode(string);
      const len = Math.min(length, this.data.length - offset, encoded.length);
      for (let i = 0; i < len; i++) {
        this.data[offset + i] = encoded[i];
      }
      return len;
    }

    slice(start, end) {
      return new Buffer(this.data.slice(start, end));
    }

    static isBuffer(obj) {
      return obj instanceof Buffer;
    }

    static concat(list) {
      let totalLength = 0;
      for (const buf of list) {
        totalLength += buf.length;
      }
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of list) {
        result.set(buf.data, offset);
        offset += buf.length;
      }
      return new Buffer(result);
    }

    get length() {
      return this.data.length;
    }

    toJSON() {
        return {
            type: 'Buffer',
            data: Array.from(this.data)
        };
    }

    equals(otherBuffer) {
      if (!Buffer.isBuffer(otherBuffer)) {
        return false;
      }
      if (this.length !== otherBuffer.length) {
        return false;
      }
      for (let i = 0; i < this.length; i++) {
        if (this.data[i] !== otherBuffer.data[i]) {
          return false;
        }
      }
      return true;
    }

    indexOf(value, byteOffset, encoding) {
      if (typeof value === 'string') {
        value = new Buffer(value, encoding).data[0];
      }
      for (let i = byteOffset || 0; i < this.length; i++) {
        if (this.data[i] === value) {
          return i;
        }
      }
      return -1;
    }

    copy(targetBuffer, targetStart, sourceStart, sourceEnd) {
      targetStart = targetStart || 0;
      sourceStart = sourceStart || 0;
      sourceEnd = sourceEnd || this.length;

      if (sourceEnd > this.length) {
        throw new Error('Source end exceeds buffer length');
      }

      if (targetStart >= targetBuffer.length) {
        throw new Error('Target start out of bounds');
      }

      const len = Math.min(sourceEnd - sourceStart, targetBuffer.length - targetStart);

      for (let i = 0; i < len; i++) {
        targetBuffer.data[targetStart + i] = this.data[sourceStart + i];
      }

      return len;
    }
  };
})();
edit filepath: api/encryption.js
content: const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Generate a 256-bit key
const iv = crypto.randomBytes(16); // Generate a 128-bit IV

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text, ivHex) {
    let iv = Buffer.from(ivHex, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };