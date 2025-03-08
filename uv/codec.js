import { subtle, getRandomValues } from 'crypto';

async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    const key = await subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: enc.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


export async function encode(str, key = null, salt = null) {
    try {
        if (!str) return '';

        const utf8Encode = new TextEncoder();
        const encoded = utf8Encode.encode(str);

        if (key && salt) {
            const iv = getRandomValues(new Uint8Array(12));
            const cryptoKey = await deriveKey(key, salt);
            const { ciphertext, tag } = await subtle.encrypt(
                { name: "AES-GCM", iv: iv, tagLength: 128 },
                cryptoKey,
                encoded
            );

            const combined = new Uint8Array(iv.length + ciphertext.byteLength + tag.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(ciphertext), iv.length);
            combined.set(new Uint8Array(tag), iv.length + ciphertext.byteLength);

            return arrayBufferToBase64(combined);

        }


        return arrayBufferToBase64(encoded);
    } catch (e) {
        console.error("Encoding error:", e);
        return null;
    }
}

export async function decode(str, key = null, salt = null) {
    try {
        if (!str) return '';

        const bytes = new Uint8Array(base64ToArrayBuffer(str));

        if (key && salt) {
            const iv = bytes.slice(0, 12);
            const ciphertext = bytes.slice(12, bytes.length - 16);
            const tag = bytes.slice(bytes.length - 16);


            const cryptoKey = await deriveKey(key, salt);

            const decrypted = await subtle.decrypt(
                { name: "AES-GCM", iv: iv, tagLength: 128 },
                cryptoKey,
                ciphertext
            );

            const utf8Decode = new TextDecoder();
            return utf8Decode.decode(decrypted);
        }


        const utf8Decode = new TextDecoder();
        return utf8Decode.decode(bytes);

    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}