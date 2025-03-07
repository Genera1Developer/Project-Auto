export function encode(str) {
  try {
    return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(str)));
  } catch (e) {
    console.error("Encoding error:", e);
    return null;
  }
}

export function decode(str) {
  try {
    return new TextDecoder().decode(new Uint8Array(Array.from(atob(str), c => c.charCodeAt(0))));
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}