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
    xorKey: 'RC4randomKeyHere',
    cloak: '/cloak.html',
    ws: true,
    requestInterceptor: (url, headers) => {
        headers['X-Proxy-Agent'] = 'Ultraviolet';
        headers['X-Forwarded-Proto'] = window.location.protocol.slice(0, -1);
        return {
            url: url,
            headers: headers
        }
    },
    responseInterceptor: (response) => {
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        response.headers['Pragma'] = 'no-cache';
        response.headers['Expires'] = '0';

        if (response.headers['Content-Type'] && response.headers['Content-Type'].includes('text/html')) {
            const securityHeaders = {
                'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'no-referrer',
                'Permissions-Policy': 'interest-cohort=()',
            };

            for (const header in securityHeaders) {
                response.headers[header] = securityHeaders[header];
            }
        }
        return response
    }
};