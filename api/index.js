const http = require('http');
const url = require('url');
const proxyRequest = require('./proxy');
const handleSettings = require('./settings');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/api/proxy') {
        proxyRequest(req, res);
    } else if (pathname === '/api/settings') {
        handleSettings(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});