self.importScripts('./uv.bundle.js', './uv.config.js');

const sw = new UVServiceWorker();

const encryptionEnabledDomains = ['example.com'];
const encryptionKeyName = 'encryptionKey';

const generateEncryptionKey = async () => {
  try {
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    localStorage.setItem(encryptionKeyName, JSON.stringify(exportedKey));
    return exportedKey;
  } catch (error) {
    console.error('Key generation failed:', error);
    throw error;
  }
};

const getEncryptionKey = async () => {
  const storedKey = localStorage.getItem(encryptionKeyName);
  if (storedKey) {
    return JSON.parse(storedKey);
  } else {
    return await generateEncryptionKey();
  }
};

const encrypt = async (data, key) => {
  try {
    const importedKey = await crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128,
      },
      importedKey,
      encoded
    );
    return {
      ciphertext: Array.from(new Uint8Array(ciphertext)),
      iv: Array.from(iv),
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

const decrypt = async (data, key, iv) => {
  try {
    const importedKey = await crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const ciphertext = new Uint8Array(data);
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
        tagLength: 128,
      },
      importedKey,
      ciphertext
    );
    const decoded = new TextDecoder().decode(decrypted);
    return decoded;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (encryptionEnabledDomains.includes(url.hostname)) {
    console.log(`Encrypting request to ${url.hostname}`);

    const handleRequest = async () => {
      try {
        const encryptionKey = await getEncryptionKey();
        const request = await fetch(event.request.clone());
        if (!request.ok) {
          throw new Error(`HTTP error! status: ${request.status}`);
        }
        let data = await request.text();
        const encryptedData = await encrypt(data, encryptionKey);
        const encryptedResponse = new Response(JSON.stringify(encryptedData), {
          headers: { 'Content-Type': 'application/json' }
        });
        return encryptedResponse;
      } catch (error) {
        console.error('Request or encryption error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    };

    const handleResponse = async () => {
      try {
        const encryptionKey = await getEncryptionKey();
        const response = await fetch(event.request.clone());
        let data = await response.clone().json();
        const decryptedData = await decrypt(data.ciphertext, encryptionKey, data.iv);
        return new Response(decryptedData, {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (error) {
        console.error('Decryption error:', error);
        return new Response('Decryption failed', { status: 500 });
      }
    };

    if (event.request.method === 'GET') {
        event.respondWith(handleRequest());
    }
    else if (event.request.method === 'POST') {
      event.respondWith(handleRequest());
    }
  } else {
    event.respondWith(sw.fetch(event));
  }
});