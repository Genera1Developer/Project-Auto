self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.aes.encode,
    decodeUrl: Ultraviolet.codec.aes.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    aesKey: 'ENCRYPTION_KEY_HERE' // Replace with a strong, randomly generated key
};