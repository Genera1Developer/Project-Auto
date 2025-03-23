const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');

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

      res.writeHead(imageRes.statusCode, imageRes.headers);
      imageRes.pipe(res);

      // Example: In-transit encryption logging (replace with actual handling)
      const cipher = crypto.createCipheriv('aes-256-cbc', crypto.randomBytes(32), crypto.randomBytes(16));
      imageRes.pipe(cipher);

      cipher.on('data', chunk => {
        // Process the encrypted chunk if needed (e.g., logging, analysis)
      });

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