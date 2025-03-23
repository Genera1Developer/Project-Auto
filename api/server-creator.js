const crypto = require('crypto');
const http = require('http');
const zlib = require('zlib');

function createSecureServer(options, requestListener) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const encryptedRequestListener = (req, res) => {
    let encryptedData = [];
    req.on('data', (chunk) => {
      encryptedData.push(chunk);
    });

    req.on('end', () => {
      if (encryptedData.length > 0) {
        try {
          const combined = Buffer.concat(encryptedData);
          const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
          const authTagLength = 16;
          const data = combined.slice(0, combined.length - authTagLength);
          const authTag = combined.slice(combined.length - authTagLength);

          decipher.setAuthTag(authTag);

          let decryptedData = decipher.update(data);
          decryptedData = Buffer.concat([decryptedData, decipher.final()]);

          zlib.gunzip(decryptedData, (err, inflated) => {
            if (err) {
              console.error("Decompression error:", err);
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('Decompression failed.');
              return;
            }
            try{
              req.body = JSON.parse(inflated.toString('utf8'));
            } catch (parseError) {
              console.error("JSON parse error:", parseError);
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('JSON Parse failed.');
              return;
            }
            requestListener(req, res);
          });

        } catch (error) {
          console.error("Decryption error:", error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Decryption failed.');
          return;
        }
      } else {
        requestListener(req, res);
      }
    });
  };

  const server = http.createServer(encryptedRequestListener);

  server.encryptionDetails = {
    key: key.toString('hex'),
    iv: iv.toString('hex')
  };

  return server;
}

module.exports = createSecureServer;