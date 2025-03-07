const UV_CONFIG = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    error: '/uv/uv.error.html',
    cloak: '/uv/uv.cloak.js',
    blacklist: [],
    loglevel: 'info',
    learnMore: 'https://github.com/titaniumnetwork-dev/Ultraviolet',
    domain: location.origin, // Sets the domain for secure cookie handling
    cookieScope: '/', // Cookie scope set to root for broad access
    ws: true, // Enable WebSocket proxying
    version: '1.3.0', // Version of Ultraviolet
    // Add more configuration options as needed
};