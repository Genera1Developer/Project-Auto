self.importScripts('./uv.bundle.js', './uv.config.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'example.com') {
    console.log('Encrypting request to example.com');

    const encrypt = async (data) => {
      const key = await crypto.subtle.generateKey(
        {
          name: "AES-CBC",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const encoded = new TextEncoder().encode(data);
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        key,
        encoded
      );
      return {
        ciphertext: Array.from(new Uint8Array(ciphertext)),
        iv: Array.from(iv),
        key: await crypto.subtle.exportKey("jwk", key),
      };
    };

    const decrypt = async (data, key, iv) => {
      const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        {
          name: "AES-CBC",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      const ciphertext = new Uint8Array(data);
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: new Uint8Array(iv),
        },
        importedKey,
        ciphertext
      );
      const decoded = new TextDecoder().decode(decrypted);
      return decoded;
    };

    const handleRequest = async () => {
      try {
        const response = await fetch(event.request.clone());
        let data = await response.text();

        const encryptedData = await encrypt(data);

        const encryptedResponse = new Response(JSON.stringify(encryptedData), {
          headers: { 'Content-Type': 'application/json' }
        });

        return encryptedResponse;
      } catch (error) {
        console.error('Encryption error:', error);
        return new Response('Encryption failed', { status: 500 });
      }
    };

    event.respondWith(handleRequest());
  } else {
    event.respondWith(sw.fetch(event));
  }
});