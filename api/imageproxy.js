const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');
const zlib = require('zlib');

module.exports = async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    const parsedUrl = new url.URL(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const imageReq = protocol.get(imageUrl, (imageRes) => {
      if (imageRes.statusCode >= 400) {
        return res.status(imageRes.statusCode).send(`Image server error: ${imageRes.statusCode}`);
      }

      const headers = { ...imageRes.headers };

      // Remove Content-Length to avoid issues when modifying body
      delete headers['content-length'];

      res.writeHead(imageRes.statusCode, headers);

      const cipher = crypto.createCipheriv('aes-256-ctr', crypto.randomBytes(32), crypto.randomBytes(16));
      const gzip = zlib.createGzip();

      imageRes.pipe(cipher).pipe(gzip).pipe(res);


    }).on('error', (err) => {
      console.error('Error fetching image:', err);
      res.status(500).send(`Error fetching image: ${err.message}`);
    });

    req.on('close', () => {
      imageReq.destroy();
    });

  } catch (err) {
    console.error('Invalid URL:', err);
    res.status(400).send('Invalid URL');
  }
};