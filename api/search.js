import axios from 'axios';
import { Transform } from 'stream';
import { URL } from 'url';

const searxInstance = 'https://searx.be';

// Define a default CSP, allowing customization via query parameter.
const defaultCsp = `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *;`;

async function modifyHtml(htmlString, csp) {
  if (!htmlString) return htmlString; // prevent errors with empty htmlString

  let chunkStr = htmlString;
  const resourceTypes = ['href', 'src', 'action', 'data-url', 'poster'];

  for (const type of resourceTypes) {
    // Correctly handle URLs with existing query parameters
    const regexAbsolute = new RegExp(`${type}=["'](https?:\/\/[^"']+)["']`, 'gi');
    chunkStr = chunkStr.replace(regexAbsolute, (match, url) => {
        try {
            new URL(url); // Validate the URL
            return `${type}="/api/proxy?q=${encodeURIComponent(url)}&csp=${encodeURIComponent(csp)}"`
        } catch (e) {
            console.warn(`Invalid URL found in ${type}: ${url}. Skipping.`);
            return match; // Return original match if URL is invalid
        }
    });

    const regexRelative = new RegExp(`${type}=["'](\/[^"']+)["']`, 'gi');
    chunkStr = chunkStr.replace(regexRelative, (match, url) => {
        try {
            new URL(searxInstance + url); // Validate the URL

            return `${type}="/api/proxy?q=${encodeURIComponent(searxInstance + url)}&csp=${encodeURIComponent(csp)}"`
        } catch (e) {
             console.warn(`Invalid URL found in ${type}: ${url}. Skipping.`);
             return match; // Return original match if URL is invalid
        }
    });
  }

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
    timeout: 10000,
    // Prevent axios from automatically parsing the response.
    transformResponse: [(data) => data]
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
        if (!chunk) {
          return callback(null, chunk); // Handle empty chunks
        }
        let chunkStr = chunk.toString('utf8');
        chunkStr = await modifyHtml(chunkStr, csp);
        callback(null, chunkStr);
      } catch (e) {
        console.error("Error during HTML transformation:", e);
        callback(e);
      }
    }
  });

  // Copy headers from the origin response, excluding those that should not be copied or modified
  for (const [key, value] of Object.entries(response.headers)) {
    if (!['content-length', 'content-encoding', 'transfer-encoding', 'content-security-policy', 'content-type'].includes(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  }

  // Set the CSP header. This overrides any CSP from the origin server.
  res.setHeader('Content-Security-Policy', csp);

  // Set content type to ensure proper rendering.
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');


  response.data.pipe(transformStream).pipe(res);

  transformStream.on('error', (err) => {
    console.error('Transform stream error:', err);
    if (!res.headersSent) {
        res.status(500).send('Transform stream error');
    }
    res.end();
  });

  response.data.on('error', (err) => {
    console.error('SearX stream error:', err);
      if (!res.headersSent) {
          res.status(500).send('SearX stream error');
      }
    res.end();
  });

    res.on('close', () => {
        // Clean up resources if the client closes the connection prematurely.
        response.data.unpipe(transformStream);
        transformStream.destroy();
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
  csp = Array.isArray(csp) ? csp[0] : defaultCsp; // Use default CSP if not provided

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
    // Provide more informative error message and include status code if available
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'An unexpected error occurred';
    if (!res.headersSent) {
      res.status(statusCode).send(`
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
            <p>An error occurred: ${errorMessage} (Status Code: ${statusCode})</p>
          </body>
        </html>
      `);
    } else {
        console.warn("Error occurred but headers already sent, unable to send error page.");
    }
  } finally {
    res.end(); // Ensure the response is always ended
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};