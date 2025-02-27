const { URL } = require('url');
const https = require('https');
const http = require('http');
const cors = require('./cors');
const httpsAgent = require('./httpsAgent');

module.exports = async (req, res) => {
    cors(req, res, () => {
        const { url: targetUrl } = req.query;

        if (!targetUrl) {
            return res.status(400).send('URL parameter is required');
        }

        try {
            const parsedTargetUrl = new URL(targetUrl);
            const protocol = parsedTargetUrl.protocol === 'https:' ? https : http;

            const options = {
                agent: parsedTargetUrl.protocol === 'https:' ? httpsAgent : undefined,
                headers: {
                    'User-Agent': req.headers['user-agent'] || 'Web-Proxy',
                    'Referer': req.headers['referer'] || parsedTargetUrl.origin,
                },
            };

            protocol.get(targetUrl, options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            }).on('error', (e) => {
                console.error('Proxy error:', e);
                res.status(500).send('Proxy error');
            });
        } catch (error) {
            console.error('URL parsing error:', error);
            res.status(400).send('Invalid URL');
        }
    });
};