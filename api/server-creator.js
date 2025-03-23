const crypto = require('crypto');
const http = require('http');

function createSecureServer(options, requestListener) {
  const key = crypto.randomBytes(32).toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');

  const encryptedRequestListener = (req, res) => {
    let encryptedData = '';
    req.on('data', (chunk) => {
      encryptedData += chunk;
    });

    req.on('end', () => {
      if (encryptedData) {
        try {
          const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
          let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
          decryptedData += decipher.final('utf8');

          req.body = JSON.parse(decryptedData);
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Decryption failed.');
          return;
        }
      }
      requestListener(req, res);
    });
  };


  const server = http.createServer(encryptedRequestListener);

  server.encryptionDetails = { key, iv };

  return server;
}

module.exports = createSecureServer;