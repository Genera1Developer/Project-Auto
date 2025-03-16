document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', async function() {
        const url = urlInput.value;
        if (!url) {
            contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
            return;
        }

        try {
            const response = await fetch('/api/proxy?url=' + encodeURIComponent(url));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            contentDiv.innerHTML = data;
        } catch (error) {
            console.error('Error fetching proxied content:', error);
            contentDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    });
});
edit filepath: api/proxy.js
content: const https = require('https');
const http = require('http');
const url = require('url');

module.exports = async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('URL parameter is required');
        return;
    }

    try {
        const parsedUrl = new url.URL(targetUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: req.headers // Forward original headers, but sanitize if needed
        };

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const proxyReq = protocol.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy request error:', error);
            res.status(500).send(`Proxy error: ${error.message}`);
        });

        req.pipe(proxyReq, { end: true }); // Pipe the request to the target
    } catch (error) {
        console.error('URL parsing or proxy error:', error);
        res.status(400).send(`Invalid URL or proxy error: ${error.message}`);
    }
};