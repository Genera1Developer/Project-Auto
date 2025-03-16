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
    cacheExpiration: 3600,
    customEncryption: false,
    customEncodeUrl: null,
    customDecodeUrl: null,
    // Enhanced Security Features: Adding nonce for CSP and HSTS
    cspNonce: generateNonce(), // Function to generate a unique nonce
    hstsMaxAge: 31536000, // HSTS max-age in seconds (1 year)
    hstsIncludeSubDomains: true, // Include subdomains in HSTS policy
    hstsPreload: true // Enable HSTS preload
};

function generateNonce() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}