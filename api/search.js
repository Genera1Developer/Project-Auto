import axios from 'axios';
import { Transform } from 'stream';
import { URL } from 'url';

const searxInstance = 'https://searx.be';

async function modifyHtml(htmlString) {
  let chunkStr = htmlString;
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

  return chunkStr;
}

function determineSearchUrl(q) {
  try {
    new URL(q);
    return q;
  } catch {
    return `${searxInstance}/search`;
  }
}

function buildAxiosConfig(searchUrl, q) {
  const config = {
    method: 'GET',
    url: searchUrl,
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

  if (searchUrl === `${searxInstance}/search`) {
    config.params = {
      q: q,
      format: 'html',
      language: 'en-US',
      categories: 'general,images,videos,news',
      theme: 'simple',
      safesearch: 0
    };
  }

  return config;
}

function handleHtmlResponse(response, res) {
  const transformStream = new Transform({
    async transform(chunk, encoding, callback) {
      try {
        let chunkStr = chunk.toString('utf8');
        chunkStr = await modifyHtml(chunkStr);
        callback(null, chunkStr);
      } catch (e) {
        callback(e);
      }
    }
  });

  for (const [key, value] of Object.entries(response.headers)) {
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
}

function handleNonHtmlResponse(response, res) {
  for (const [key, value] of Object.entries(response.headers)) {
    if (!['content-length', 'content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  }
  response.data.pipe(res);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  q = Array.isArray(q) ? q[0] : q;
  const searchUrl = determineSearchUrl(q);
  const axiosConfig = buildAxiosConfig(searchUrl, q);

  try {
    const response = await axios(axiosConfig);
    const contentType = response.headers['content-type'];

    if (!contentType || !contentType.includes('text/html')) {
      handleNonHtmlResponse(response, res);
    } else {
      handleHtmlResponse(response, res);
    }

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