export function encode(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function decode(str) {
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(str), c => c.charCodeAt(0)));
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}