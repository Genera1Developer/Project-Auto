export function encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}