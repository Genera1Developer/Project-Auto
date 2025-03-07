export function encode(str) {
  try {
    const utf8Encode = new TextEncoder();
    const encoded = utf8Encode.encode(str);
    return btoa(String.fromCharCode(...new Uint8Array(encoded)));
  } catch (e) {
    console.error("Encoding error:", e);
    return null;
  }
}

export function decode(str) {
  try {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const utf8Decode = new TextDecoder();
    return utf8Decode.decode(bytes);
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}