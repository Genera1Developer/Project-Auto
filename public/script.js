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
            const decryptionKey = 'defaultEncryptionKey'; // This should be fetched securely
			const decryptedData = decrypt(encryptedData, decryptionKey);
            contentDiv.textContent = decryptedData;

        } catch (error) {
            console.error('Error fetching data:', error);
            contentDiv.textContent = `Error: ${error.message}`;
        }
    });

	function decrypt(text, key) {
		const textParts = text.split(':');
		const iv = textParts.shift();
		const authTag = textParts.shift();
		const encryptedText = textParts.join(':');
	
		const ivBuffer = hexToBytes(iv);
		const authTagBuffer = hexToBytes(authTag);
		const encryptedTextBuffer = hexToBytes(encryptedText);
	
		const keyBuffer = new TextEncoder().encode(key);
		
		return window.crypto.subtle.importKey(
			"raw",
			keyBuffer,
			"AES-CBC",
			false,
			["encrypt", "decrypt"]
		).then(function(key){
			const algorithm = {
				name: "AES-CBC",
				iv: ivBuffer,
			};
			
			return window.crypto.subtle.decrypt(
				algorithm,
				key,
				encryptedTextBuffer
			);
		}).then(function(decrypted){
			let decoder = new TextDecoder();
			return decoder.decode(decrypted);
		})
		.catch(function(err){
			console.error("Error decrypting:", err);
			return 'Decryption Error: ' + err.message;
		});
	}

	function hexToBytes(hex) {
		let bytes = [];
		for (let c = 0; c < hex.length; c += 2)
		bytes.push(parseInt(hex.substr(c, 2), 16));
		return new Uint8Array(bytes);
	}
});