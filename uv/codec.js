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


export async function encode(str, key = null, salt = null) {
    try {
        if (!str) return '';

        const utf8Encode = new TextEncoder();
        const encoded = utf8Encode.encode(str);

        if (key && salt) {
            const iv = getRandomValues(new Uint8Array(12));
            const cryptoKey = await deriveKey(key, salt);
            const encrypted = await subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encoded
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);

            return btoa(String.fromCharCode(...combined));

        }


        return btoa(String.fromCharCode(...encoded));
    } catch (e) {
        console.error("Encoding error:", e);
        return null;
    }
}

export async function decode(str, key = null, salt = null) {
    try {
        if (!str) return '';

        const binaryString = atob(str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        if (key && salt) {
            const iv = bytes.slice(0, 12);
            const encrypted = bytes.slice(12);

            const cryptoKey = await deriveKey(key, salt);

            const decrypted = await subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encrypted
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