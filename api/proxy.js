const https = require('https');
const http = require('http');
const crypto = require('crypto');

const AES_KEY = crypto.randomBytes(32); // 256-bit key
const AES_IV = crypto.randomBytes(16); // 128-bit IV

function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return AES_IV.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function handleRequest(req, res) {
  const targetURL = req.headers['x-target-url'];

  if (!targetURL) {
    return res.status(400).send('Target URL is missing.');
  }

  delete req.headers['x-target-url']; // Remove custom header

  const parsedURL = new URL(targetURL);
  const options = {
    hostname: parsedURL.hostname,
    path: parsedURL.pathname + parsedURL.search,
    method: req.method,
    headers: req.headers,
  };

  const proxyRequest = (parsedURL.protocol === 'https:' ? https : http).request(options, (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);

    proxyResponse.on('data', (chunk) => {
      try {
        const encrypted = encrypt(chunk.toString('utf8'));
        res.write(encrypted);
      } catch (error) {
        console.error('Encryption error:', error);
        res.write(chunk); // Send unencrypted on error
      }
    });

    proxyResponse.on('end', () => {
      res.end();
    });

    proxyResponse.on('error', (error) => {
      console.error('Proxy response error:', error);
      res.status(500).send('Proxy response error.');
    });
  });

  req.on('data', (chunk) => {
    try {
      const decrypted = decrypt(chunk.toString('utf8'));
      proxyRequest.write(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      proxyRequest.write(chunk); // Send unencrypted on error
    }
  });

  req.on('end', () => {
    proxyRequest.end();
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
    res.status(500).send('Request error.');
  });

  proxyRequest.on('error', (error) => {
    console.error('Proxy request error:', error);
    res.status(500).send('Proxy request error.');
  });
}

module.exports = handleRequest;