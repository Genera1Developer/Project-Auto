const { URL } = require('url');
const https = require('https');
const http = require('http');
const cors = require('./cors');
const httpsAgent = require('./httpsAgent');

module.exports = async (req, res) => {
    cors(req, res, () => {
        let { url: targetUrl } = req.query;

        if (!targetUrl) {
            return res.status(400).send('URL parameter is required');
        }

        try {
            targetUrl = decodeURIComponent(targetUrl);
            const parsedTargetUrl = new URL(targetUrl);
            const protocol = parsedTargetUrl.protocol === 'https:' ? https : http;

            const options = {
                method: req.method, // Forward the original request method
                agent: parsedTargetUrl.protocol === 'https:' ? httpsAgent : undefined,
                headers: {
                    ...req.headers, // Forward all original headers
                    'User-Agent': req.headers['user-agent'] || 'Web-Proxy',
                    'Referer': req.headers['referer'] || parsedTargetUrl.origin,
                    'X-Forwarded-For': req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
                    'Host': parsedTargetUrl.host, // Set the Host header to the target URL's host
                },
                followRedirects: false, // Handle redirects manually to avoid issues
            };

            // Remove potentially problematic headers
            delete options.headers['content-length'];
            delete options.headers['content-encoding'];
            delete options.headers['transfer-encoding']; // Remove transfer-encoding
            delete options.headers['connection']; //Remove connection header

            const proxyReq = protocol.request(targetUrl, options, (proxyRes) => {
                // Handle redirects manually
                if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                    let redirectUrl = proxyRes.headers.location;
                    // Resolve relative redirects
                    redirectUrl = new URL(redirectUrl, targetUrl).toString();

                    // Redirect the client
                    res.redirect(proxyRes.statusCode, redirectUrl);
                    return;
                }

                // Remove hop-by-hop headers (connection, keep-alive, etc.) from response
                const { 'content-encoding': contentEncoding, ...filteredHeaders } = proxyRes.headers;

                res.writeHead(proxyRes.statusCode, filteredHeaders);
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (e) => {
                console.error('Proxy request error:', e);
                res.status(500).send(`Proxy request error: ${e.message}`);
            });


            // Pipe the request body, handle undefined/null body gracefully
            if (req.method !== 'GET' && req.method !== 'HEAD' && req.readable) {
                req.pipe(proxyReq);
            } else {
                proxyReq.end();
            }
        } catch (error) {
            console.error('URL parsing error:', error);
            res.status(400).send(`Invalid URL: ${error.message}`);
        }
    });
};