const UV_CONFIG = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.base64.encode,
    decodeUrl: Ultraviolet.codec.base64.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    error: '/uv/uv.error.html',
    cloak: '/uv/uv.cloak.js',
    blacklist: [],
};