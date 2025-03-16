document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async () => {
        const url = urlInput.value;

        if (!url) {
            contentDiv.textContent = 'Please enter a URL.';
            contentDiv.classList.add('error');
            return;
        }

        contentDiv.classList.remove('error');
        contentDiv.textContent = 'Loading...';

        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const encryptedData = await response.text();
			const decryptionKey = 'defaultEncryptionKey';

			const decryptedData = decrypt(encryptedData, decryptionKey);


            contentDiv.textContent = decryptedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = 'Error: ' + error.message;
            contentDiv.classList.add('error');
        }
    });

	function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = textParts.shift();
	const authTag = textParts.shift();
    const encryptedText = textParts.join(':');


	const ivBuffer = hexToArrayBuffer(iv);
	const authTagBuffer = hexToArrayBuffer(authTag);
    const encryptedTextBuffer = hexToArrayBuffer(encryptedText);

    return decryptData(encryptedTextBuffer, ivBuffer, authTagBuffer, key);
}

async function decryptData(encryptedData, iv, authTag, secretKey) {
    try {
        const key = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secretKey),
            "AES-GCM",
            false,
            ["decrypt"]
        );

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
				tagLength: 128,
            },
            key,
            encryptedData
        );

        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        console.error("Decryption error:", error);
        return 'Decryption Failed: ' + error.message;
    }
}

function hexToArrayBuffer(hexString) {
    const hexLength = hexString.length;
    const bytes = new Uint8Array(hexLength / 2);
    for (let i = 0; i < hexLength; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes.buffer;
}
});