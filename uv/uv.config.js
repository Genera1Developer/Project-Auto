self.__uv$config = {
    prefix: '/service/',
    bare: [
        'https://bare.benusers.repl.co/',
        'https://bare-server.dev-jc.cf/',
        'https://tomp.ml/bare/',
        'https://bare.n-coded.com/',
        'https://node-ultra.glitch.me/',
    ],
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    encryptionKey: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    encryptPayloads: true,
    scp: true,
    csp: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' wss:;",
    injectHeaders: true,
    logRequests: false,
    cookieDomainRewrite: '',
    cookiePathRewrite: '/',
    forwardCookies: true,
    strictOriginHandling: true,
    tlsPassthrough: true,
    //New Feature: Adding cache control to improve performance and reduce load on bare servers
    cacheExpiration: 3600, // Cache expiration time in seconds (e.g., 1 hour)
    //New Feature: Support for custom encryption algorithms
    customEncryption: false, // Set to true if using a custom encryption algorithm
    customEncodeUrl: null, // Function to encode URLs using the custom algorithm
    customDecodeUrl: null  // Function to decode URLs using the custom algorithm
};