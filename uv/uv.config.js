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
    xorKey: 'aVeryLongAndRandomlyGeneratedSecureKeyWithSufficientEntropyAndMoreCharactersThatIsAtLeast128Bits',
    // Ensure XOR key is long and complex. Minimum 128 bits (16 characters) recommended, but longer is better. Aim for at least 64 characters.
    // Service worker scope depends on prefix. It is highly recommended to customize the prefix. Consider using a UUID for added randomness.
    };