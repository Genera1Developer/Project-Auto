self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    injectedScripts: '/uv/uv.injected.js',
    xorKey: 'PLEASE_REPLACE_THIS_WITH_A_STRONG_RANDOM_KEY',
    cloak: '/cloak.html',
    ws: true,
};