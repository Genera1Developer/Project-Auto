const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


module.exports = async (req, res) => {
  try {
    let url = req.query.url;

    if (!url) {
      return res.status(400).send('URL parameter is required');
    }

    const https = require('https');
    const http = require('http');
    const { URL } = require('url');

    const targetURL = new URL(url);

    const protocol = targetURL.protocol === 'https:' ? https : http;

    protocol.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const encryptedData = encrypt(data);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(encryptedData));
      });
    }).on('error', (err) => {
      console.error(err);
      res.status(500).send('Error fetching data from the target URL');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};