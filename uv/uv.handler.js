const { URL } = require('url');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const tls = require('tls');
const { brotliDecompressSync, gunzipSync, inflateSync } = require('zlib');

const sanitizedHeaders = (headers) => {
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
    'transfer-encoding',
    'te',
    'trailer',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
  ];

  const cleanedHeaders = {};
  for (const header in headers) {
    if (!hopByHopHeaders.includes(header.toLowerCase())) {
      if (typeof headers[header] === 'string') {
        let value = headers[header];
        if (value && (value.includes('\n') || value.includes('\r'))) {
          console.warn(`Removed header ${header} due to newline/carriage return character.`);
        } else {
          cleanedHeaders[header] = value;
        }
      } else if (Array.isArray(headers[header])) {
        const sanitizedArray = headers[header].map(item => {
          if (typeof item === 'string') {
            let sanitizedItem = item.replace(/[\r\n]/g, '');
            if (sanitizedItem !== item) {
              console.warn(`Sanitized array header ${header} due to newline/carriage return character.`);
            }
            return sanitizedItem;
          }
          return item;
        });
        cleanedHeaders[header] = sanitizedArray;
      } else {
        cleanedHeaders[header] = headers[header];
      }
    }
  }
  return cleanedHeaders;
};

const tlsRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

const secureCiphers = [
  'TLS_AES_128_GCM_SHA256',
  'TLS_AES_256_GCM_SHA384',
  'TLS_CHACHA20_POLY1305_SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-RSA-CHACHA20-POLY1305'
].join(':');

const secureProtocols = ['TLSv1.2', 'TLSv1.3'];

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
      headers: sanitizedHeaders(req.headers),
      timeout: 30000,
      followRedirects: false,
      agent: false,
      servername: target,
      rejectUnauthorized: tlsRejectUnauthorized,
      secureProtocol: 'TLSv1_2_method',
      ciphers: secureCiphers,
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
    };

    options.headers['x-forwarded-for'] = req.socket.remoteAddress || req.connection.remoteAddress || crypto.randomBytes(16).toString('hex');

    if (!options.headers['user-agent']) {
      options.headers['user-agent'] = 'uv-proxy/1.0';
    }

    // Mitigate HTTP Request Smuggling by always setting `content-length` to '0' when there is no request body.
    if (req.method === 'GET' || req.method === 'HEAD') {
      options.headers['content-length'] = '0';
    }

    const proxyReq = (url.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      let resHeaders = sanitizedHeaders(proxyRes.headers);

      // Remove potentially harmful headers
      delete resHeaders['content-security-policy'];
      delete resHeaders['x-frame-options'];
      delete resHeaders['x-xss-protection'];

      // Strip potentially problematic headers
      delete resHeaders['transfer-encoding'];

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
            if (res.socket && !res.socket.destroyed) {
              res.socket.destroy();
            }
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

          if (socket.authorized === false) {
              console.error(`TLS handshake failed for ${target}: ${socket.authorizationError}`);
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
          if (res.socket && !res.socket.destroyed) {
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
          if (res.socket && !res.socket.destroyed) {
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
        if (res.socket && !res.socket.destroyed) {
          res.socket.destroy();
        }
      } catch (e) {
        console.error("Error destroying socket after unexpected error:", e);
      }
    }
  }
}

module.exports = { handleRequest };