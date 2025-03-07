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
    xorKey: 'aVeryLongAndRandomlyGeneratedSecureKeyWithSufficientEntropyAndMoreCharactersThatIsAtLeast128BitsAndEvenLongerToEnsureSecurity',
    // Ensure XOR key is long and complex. Minimum 128 bits (16 characters) recommended, but longer is better. Aim for at least 64 characters.
    // For enhanced security, use a CSP nonce or SRI hash for injected scripts.
    // Consider rotating the XOR key regularly for enhanced security.
    // Service worker scope depends on prefix. It is highly recommended to customize the prefix. Consider using a UUID for added randomness.
    cloak: '/cloak.html',
};