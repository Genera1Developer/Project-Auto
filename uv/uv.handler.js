const { URL } = require('url');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const tls = require('tls');
const { brotliDecompressSync, gunzipSync, inflateSync } = require('zlib');

async function handleRequest(req, res) {
  try {
    const urlString = req.url.slice(1);
    if (!urlString) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No URL provided.');
      return;
    }

    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      console.error('Invalid URL:', urlString, err);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid URL format: ' + err.message);
      return;
    }

    const target = url.hostname;
    const port = url.port || (url.protocol === 'https:' ? 443 : 80);
    const path = url.pathname + url.search;

    const options = {
      hostname: target,
      port: port,
      path: path,
      method: req.method,
      headers: { ...req.headers },
      timeout: 10000,
      followRedirects: false,
      agent: false, // Disable connection pooling
      servername: target,
      rejectUnauthorized: true,
      secureProtocol: 'TLSv1_2_method',
      ciphers: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-CHACHA20-POLY1305'
      ].join(':'),
      minVersion: 'TLSv1.2'
    };

    const hopByHopHeaders = [
      'host',
      'origin',
      'connection',
      'upgrade',
      'accept-encoding',
      'proxy-connection',
      'if-none-match',
      'if-modified-since',
      'pragma',
      'cache-control',
      'transfer-encoding'
    ];

    hopByHopHeaders.forEach(header => delete options.headers[header]);

    options.headers['x-forwarded-for'] = req.socket.remoteAddress || req.connection.remoteAddress || crypto.randomBytes(16).toString('hex');

    if (!options.headers['user-agent']) {
      options.headers['user-agent'] = 'uv-proxy/1.0';
    }

    const proxyReq = (url.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      let resHeaders = { ...proxyRes.headers };

      delete resHeaders['content-encoding'];

      Object.keys(resHeaders).forEach(header => {
        if (typeof resHeaders[header] === 'string') {
          const value = resHeaders[header];
          if (value.includes('\n') || value.includes('\r')) {
            delete resHeaders[header];
            console.warn(`Removed header ${header} due to newline/carriage return character.`);
          }
        } else if (Array.isArray(resHeaders[header])) {
          resHeaders[header] = resHeaders[header].map(item => {
            if (typeof item === 'string') {
              let sanitizedItem = item.replace(/[\r\n]/g, '');
              if (sanitizedItem !== item) {
                console.warn(`Sanitized array header ${header} due to newline/carriage return character.`);
              }
              return sanitizedItem;
            }
            return item;
          });
        }
      });

      res.writeHead(proxyRes.statusCode, resHeaders);

      proxyRes.on('data', (chunk) => {
          res.write(chunk);
      });

      proxyRes.on('end', () => {
          res.end();
      });

      proxyRes.on('error', (err) => {
          console.error('Proxy response error:', err);
          if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'text/plain' });
              res.end('Proxy response error: ' + err.message);
          } else {
              try {
                  res.socket.destroy();
              } catch (e) {
                  console.error("Error destroying socket after proxy response error:", e);
              }
          }
      });
    });

    proxyReq.setTimeout(options.timeout, () => {
      proxyReq.destroy(new Error('Proxy request timeout.'));
    });

    proxyReq.on('socket', (socket) => {
        socket.on('secureConnect', () => {
            if (url.protocol === 'https:') {
                const tlsInfo = socket.getPeerCertificate();
                if (tlsInfo && tlsInfo.subject) {
                    console.log(`Connected to ${target} with certificate subject: ${tlsInfo.subject.CN}`);
                }
                if (tlsInfo && tlsInfo.valid_to) {
                    const expiryDate = new Date(tlsInfo.valid_to);
                    if (expiryDate < new Date()) {
                        console.warn(`Certificate for ${target} has expired.`);
                    }
                }
            }
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + err.message);
      } else {
        try {
          if (res.socket) {
            res.socket.destroy();
          }
        } catch (e) {
          console.error("Error destroying socket after proxy error:", e);
        }
      }
    });

    req.pipe(proxyReq);

    req.on('error', (err) => {
      console.error('Request pipe error:', err);
      proxyReq.destroy(err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Request error: ' + err.message);
      } else {
        try {
          if (res.socket) {
            res.socket.destroy();
          }
        } catch (e) {
          console.error("Error destroying socket after request error:", e);
        }
      }
    });

    proxyReq.on('close', () => {
      if (!req.complete && !req.destroyed) {
        req.destroy();
      }
    });

    res.on('close', () => {
      proxyReq.destroy();
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error: ' + error.message);
    } else {
      try {
        if (res.socket) {
          res.socket.destroy();
        }
      } catch (e) {
        console.error("Error destroying socket after unexpected error:", e);
      }
    }
  }
}

module.exports = { handleRequest };