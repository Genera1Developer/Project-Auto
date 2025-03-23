const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');
const zlib = require('zlib');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Store securely!
const IV_LENGTH = 16;

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

      // Set Content-Encoding to indicate gzipped content
      headers['content-encoding'] = 'gzip';

      res.writeHead(imageRes.statusCode, headers);

      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
      const gzip = zlib.createGzip();

      // Prepend IV to the output stream
      res.write(iv);

      imageRes.pipe(gzip).pipe(cipher).pipe(res);

      cipher.on('end', () => {
        try{
            const authTag = cipher.getAuthTag();
            res.write(authTag);
        } catch (error){
            console.error("error getting authTag: ", error);
        }

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