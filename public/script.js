async function encryptAndSend(data, publicKey) {
  try {
    const enc = new TextEncoder();
    const encodedData = enc.encode(data);

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      encodedData
    );

    // Use TextEncoder to convert the ArrayBuffer to a Base64 string
    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return encryptedBase64;

  } catch (error) {
    console.error("Encryption error:", error);
    alert("Encryption failed. Check console for details."); // Notify user
    throw error; // Re-throw to handle it upstream
  }
}

async function decryptData(encryptedBase64, privateKey) {
    try {
        const encryptedData = new Uint8Array(atob(encryptedBase64).split('').map(char => char.charCodeAt(0)));

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );

        const dec = new TextDecoder();
        const decryptedData = dec.decode(decrypted);
        return decryptedData;

    } catch (error) {
        console.error("Decryption error:", error);
        alert("Decryption failed. Check console for details."); // Notify user
        throw error; // Re-throw to handle it upstream
    }
}

async function generateKeyPairs() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );
    return keyPair;
  } catch (error) {
    console.error("Key generation error:", error);
     alert("Key generation failed. Check console for details."); // Notify user
    throw error; // Re-throw to handle it upstream
  }
}

async function exportPublicKey(publicKey) {
  try {
    const exported = await window.crypto.subtle.exportKey(
      "jwk",
      publicKey
    );
    return exported;
  } catch (error) {
    console.error("Public key export error:", error);
    alert("Public key export failed. Check console for details."); // Notify user
    throw error; // Re-throw to handle it upstream
  }
}

async function importPublicKey(jwkData) {
  try {
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      jwkData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
    return publicKey;
  } catch (error) {
    console.error("Public key import error:", error);
    alert("Public key import failed. Check console for details."); // Notify user
    throw error; // Re-throw to handle it upstream
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    const generateKeysButton = document.getElementById('generateKeys');
    const encryptButton = document.getElementById('encrypt');
    const decryptButton = document.getElementById('decrypt');
    const publicKeyDisplay = document.getElementById('publicKey');
    const originalText = document.getElementById('originalText');
    const encryptedText = document.getElementById('encryptedText');
    const decryptedText = document.getElementById('decryptedText');
    const downloadPublicKeyButton = document.getElementById('downloadPublicKey'); // Added download button
    const importPublicKeyButton = document.getElementById('importPublicKey');
    const importedPublicKeyInput = document.getElementById('importedPublicKey');

    let publicKey = null;
    let privateKey = null;

    generateKeysButton.addEventListener('click', async () => {
        try {
            const keyPair = await generateKeyPairs();
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;

            const exportedPublicKey = await exportPublicKey(publicKey);
            publicKeyDisplay.textContent = JSON.stringify(exportedPublicKey, null, 2);

            encryptButton.disabled = false;
            decryptButton.disabled = false;
            downloadPublicKeyButton.disabled = false; // Enable download button
        } catch (error) {
            console.error("Key generation failed:", error);
            alert("Key generation failed. Check console for details.");
            encryptButton.disabled = true;  // Disable encrypt button
            decryptButton.disabled = true; // Disable decrypt button
            downloadPublicKeyButton.disabled = true; // Disable download button
        }
    });

    encryptButton.addEventListener('click', async () => {
        if (!publicKey) {
            alert('Please generate keys first.');
            return;
        }

        const text = originalText.value;
        if (!text) {
            alert('Please enter text to encrypt.');
            return;
        }

        try {
            const encrypted = await encryptAndSend(text, publicKey);
            encryptedText.value = encrypted;
            decryptButton.disabled = false; // Enable decrypt after successful encryption
        } catch (error) {
            console.error("Encryption failed:", error);
            decryptButton.disabled = true; // Disable decrypt button
        }
    });

    decryptButton.addEventListener('click', async () => {
        if (!privateKey) {
            alert('Please generate keys first.');
            return;
        }

        const encrypted = encryptedText.value;
        if (!encrypted) {
            alert('Please enter encrypted text.');
            return;
        }

        try {
            const decrypted = await decryptData(encrypted, privateKey);
            decryptedText.value = decrypted;
        } catch (error) {
            console.error("Decryption failed:", error);
        }
    });

    downloadPublicKeyButton.addEventListener('click', async () => {
        if (!publicKey) {
            alert('Please generate keys first.');
            return;
        }

        try {
            const exportedPublicKey = await exportPublicKey(publicKey);
            const publicKeyString = JSON.stringify(exportedPublicKey, null, 2);
            const blob = new Blob([publicKeyString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'public_key.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading public key:", error);
            alert("Error downloading public key. Check console for details.");
        }
    });

    importPublicKeyButton.addEventListener('click', async () => {
        try {
            const jwkString = importedPublicKeyInput.value;
            if (!jwkString) {
                alert('Please enter a public key in JWK format.');
                return;
            }

            const jwkData = JSON.parse(jwkString);
            publicKey = await importPublicKey(jwkData);

            publicKeyDisplay.textContent = JSON.stringify(jwkData, null, 2);
            encryptButton.disabled = false;
            alert('Public key imported successfully!');

        } catch (error) {
            console.error('Error importing public key:', error);
            alert('Error importing public key. Check console for details.');
            publicKey = null;
            encryptButton.disabled = true;
            publicKeyDisplay.textContent = '';
        }
    });
});