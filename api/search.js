import axios from 'axios';
import { Transform } from 'stream';
import { URL } from 'url';

const searxInstance = 'https://searx.be';

const csp = `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *;`;

async function modifyHtml(htmlString) {
  let chunkStr = htmlString;
  const resourceTypes = ['href', 'src', 'action', 'data-url', 'poster'];
  resourceTypes.forEach(type => {
    // Correctly handle URLs with existing query parameters
    chunkStr = chunkStr.replace(
      new RegExp(`${type}=["'](\/[^"']+)["']`, 'gi'),
      (match, url) => `${type}="/api/proxy?q=${encodeURIComponent(searxInstance + url)}&csp=${encodeURIComponent(csp)}"`
    );
    chunkStr = chunkStr.replace(
      new RegExp(`${type}=["'](https?:\/\/[^"']+)["']`, 'gi'),
      (match, url) => `${type}="/api/proxy?q=${encodeURIComponent(url)}&csp=${encodeURIComponent(csp)}"`
    );
  });

  // Inject CSP meta tag only if it doesn't already exist. This prevents duplicates.
  if (chunkStr.includes('<head>') && !chunkStr.includes('Content-Security-Policy')) {
    const cspTag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
    chunkStr = chunkStr.replace('<head>', `<head>${cspTag}`);
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

function handleHtmlResponse(response, res, csp) {
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
    if (!['content-length', 'content-encoding', 'transfer-encoding', 'content-security-policy'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  }

  // Set the CSP header.  This overrides any CSP from the origin server.
   res.setHeader('Content-Security-Policy', csp);
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
    if (!['content-length', 'content-encoding', 'transfer-encoding', 'content-security-policy'].includes(key.toLowerCase())) {
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

  let { q, csp } = req.query;

  if (!q) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  q = Array.isArray(q) ? q[0] : q;
    csp = Array.isArray(csp) ? csp[0] : csp;

  const searchUrl = determineSearchUrl(q);
  const axiosConfig = buildAxiosConfig(searchUrl, q);

  try {
    const response = await axios(axiosConfig);
    const contentType = response.headers['content-type'];

    if (!contentType || !contentType.includes('text/html')) {
      handleNonHtmlResponse(response, res);
    } else {
      handleHtmlResponse(response, res, csp);
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