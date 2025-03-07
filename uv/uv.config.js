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
    xorKey: 'aVeryLongAndRandomlyGeneratedSecureKeyWithSufficientEntropyAndMoreCharacters',
    // Ensure XOR key is long and complex.  Minimum 64 characters recommended.
    // Service worker scope depends on prefix.  It is highly recommended to customize the prefix.
};