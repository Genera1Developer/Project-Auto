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
    error: '/public/error.html',
    cloak: '/public/cloak.html',
};