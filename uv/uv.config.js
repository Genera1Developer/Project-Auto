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
    xorKey: 'AAAAAAAAAAAAAAAA',
    cloak: '/cloak.html',
    ws: true,
    requestInterceptor: (url, headers) => {
        // Example: Adding a custom header for enhanced security
        headers['X-Proxy-Agent'] = 'Ultraviolet';
        return {
            url: url,
            headers: headers
        }
    },
    responseInterceptor: (response) => {
        // Example: Prevent caching of proxied content
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        response.headers['Pragma'] = 'no-cache';
        response.headers['Expires'] = '0';
        return response
    }
};