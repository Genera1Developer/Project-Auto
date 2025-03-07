export function encode(str, key = null) {
  try {
    const utf8Encode = new TextEncoder();
    let encoded = utf8Encode.encode(str);

    if (key) {
      encoded = encrypt(encoded, key);
    }

    return btoa(String.fromCharCode(...new Uint8Array(encoded)));
  } catch (e) {
    console.error("Encoding error:", e);
    return null;
  }
}

export function decode(str, key = null) {
  try {
    const binaryString = atob(str);
    let bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    if (key) {
      bytes = decrypt(bytes, key);
    }

    const utf8Decode = new TextDecoder();
    return utf8Decode.decode(bytes);
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}

function encrypt(data, key) {
  const uint8Key = new TextEncoder().encode(key);
    let encryptedData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        encryptedData[i] = data[i] ^ uint8Key[i % uint8Key.length];
    }
    return encryptedData;
}

function decrypt(data, key) {
  const uint8Key = new TextEncoder().encode(key);
    let decryptedData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        decryptedData[i] = data[i] ^ uint8Key[i % uint8Key.length];
    }
    return decryptedData;
}