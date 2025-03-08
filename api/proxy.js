const https = require('https');
const http = require('http');

module.exports = (req, res) => {
    const url = req.query.url;

    if (!url) {
        res.status(400).send('URL parameter is required.');
        return;
    }

    try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        protocol.get(url, (proxyRes) => {
            let data = '';

            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                res.end(data);
            });

            proxyRes.on('error', (err) => {
                console.error('Error on proxy response:', err);
                res.status(500).send('Proxy error: ' + err.message);
            });
        }).on('error', (err) => {
            console.error('Error on proxy request:', err);
            res.status(500).send('Proxy request error: ' + err.message);
        });

    } catch (error) {
        console.error('URL parsing error:', error);
        res.status(400).send('Invalid URL: ' + error.message);
    }
};
edit filepath: .netlify/functions/proxy.js
content: const proxyHandler = require('../../api/proxy');

exports.handler = async (event, context) => {
    // Mock the request and response objects expected by the proxy handler
    const req = {
        query: event.queryStringParameters,
    };

    const res = {
        statusCode: 200,
        headers: {},
        body: '',
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        send: function(content) {
            this.body = content;
            return this;
        },
        writeHead: function(statusCode, headers) {
            this.statusCode = statusCode;
            this.headers = headers;
        },
        end: function(content) {
            this.body = content || this.body;
        },
    };

    // Execute the proxy handler
    proxyHandler(req, res);

    // Return the response in the format Netlify expects
    return {
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body,
    };
};