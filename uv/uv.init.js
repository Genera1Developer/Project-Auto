// Initialize Ultraviolet.
// This file is intended to be run *before* uv.bundle.js to configure the
// Ultraviolet environment.

// Example configuration (modify as needed):
window.UV_CONFIG = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};