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
    domain: location.origin,
    cookieScope: '/',
    ws: true,
    version: '1.3.0',
    insertCSS: [],
    insertJS: [],
    requestInterceptor: null,
    responseInterceptor: null,
    disableServiceWorker: false,
    cdn: null,
    forwardHeaders: true,
    rewriteOrigin: true,
    XORKey: '',
    advanced: {
        bypass: false,
        injections: true
    },
    encryption: true,
    injectWS: true,
    nativeProtocol: false,
    impersonate: true,
    verifyConfig: true,
    dynamicConfig: false
};