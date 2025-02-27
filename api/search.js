import axios from 'axios';
import { Transform } from 'stream';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  try {
    const searxInstance = 'https://searx.be';
    const searchQuery = Array.isArray(q) ? q[0] : q;
    let searchUrl;
    try {
      const urlTest = new URL(searchQuery);
      searchUrl = searchQuery;
    } catch {
      searchUrl = `${searxInstance}/search`;
    }

    const axiosConfig = {
      method: 'GET',
      url: searchUrl,
      ...(searchUrl === `${searxInstance}/search` ? {
        params: {
          q: searchQuery,
          format: 'html',
          language: 'en-US',
          categories: 'general,images,videos,news',
          theme: 'simple',
          safesearch: 0
        }
      } : {}),
      responseType: 'stream',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'DNT': '1',
        'Connection': 'keep-alive'
      },
      maxRedirects: 10,
      timeout: 10000
    };

    const response = await axios(axiosConfig);

    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        let chunkStr = chunk.toString('utf8');
        const resourceTypes = ['href', 'src', 'action', 'data-url', 'poster'];
        resourceTypes.forEach(type => {
          chunkStr = chunkStr.replace(
            new RegExp(`${type}=["'](\/[^"']+)["']`, 'gi'),
            (match, url) => `${type}="/api/proxy?q=${encodeURIComponent(searxInstance + url)}"`
          );
          chunkStr = chunkStr.replace(
            new RegExp(`${type}=["'](https?:\/\/[^"']+)["']`, 'gi'),
            (match, url) => `${type}="/api/proxy?q=${encodeURIComponent(url)}"`
          );
        });

        if (chunkStr.includes('<head>')) {
          const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *;">`;
          chunkStr = chunkStr.replace('<head>', `<head>${csp}`);
        }

        callback(null, chunkStr);
      }
    });

    const headers = response.headers;
    for (const [key, value] of Object.entries(headers)) {
      if (!['content-length', 'content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    response.data.pipe(transformStream).pipe(res);

    transformStream.on('error', (err) => {
      console.error('Transform stream error:', err);
      res.status(500).send('Transform stream error');
      res.end();
    });

    response.data.on('error', (err) => {
      console.error('SearX stream error:', err);
      res.status(500).send('SearX stream error');
      res.end();
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            .error { color: #e11d48; }
          </style>
        </head>
        <body>
          <h1 class="error">Error</h1>
          <p>An error occurred: ${error.message}</p>
        </body>
      </html>
    `);
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};