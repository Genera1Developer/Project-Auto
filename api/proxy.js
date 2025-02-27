import axios from 'axios';
import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
});

app.use(limiter);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const isAbsoluteURL = (url) => {
    return url.startsWith('http') || url.startsWith('//');
};

const createProxyUrl = (url, baseUrl) => {
    if (!url) return url;
    if (url.startsWith('/api/proxy.js')) return url;
    if (isAbsoluteURL(url)) {
        return `/api/proxy.js?q=${encodeURIComponent(url)}`;
    }
    if (baseUrl) {
        const base = new URL(baseUrl);
        const absoluteUrl = new URL(url, base).href;
        return `/api/proxy.js?q=${encodeURIComponent(absoluteUrl)}`;
    }
    return url;
};

const modifyHtmlContent = (htmlContent, baseUrl) => {
    const $ = cheerio.load(htmlContent);

    $('[href]').each((i, element) => {
        const href = $(element).attr('href');
        $(element).attr('href', createProxyUrl(href, baseUrl));
    });

    $('[src]').each((i, element) => {
        const src = $(element).attr('src');
        $(element).attr('src', createProxyUrl(src, baseUrl));
    });

    $('[action]').each((i, element) => {
        const action = $(element).attr('action');
        $(element).attr('action', createProxyUrl(action, baseUrl));
    });

    $('style').each((i, element) => {
        const style = $(element).html();
        if (style) {
            const modifiedStyle = style.replace(
                /url\((['"]?)([^'")\s]+)\1\)/g,
                (match, quote, url) => `url(${quote}${createProxyUrl(url, baseUrl)}${quote})`
            );
            $(element).html(modifiedStyle);
        }
    });

    return $.html();
};

app.get('/api/proxy.js', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Missing query parameter: q' });
    }

    try {
        const response = await axios.get(q, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': q,
                'Accept': req.headers['accept'] || '*/*',
                'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
            }
        });

        let contentType = response.headers['content-type'];
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600');

        if (contentType.includes('text/html')) {
            let htmlContent = response.data.toString('utf-8');
            htmlContent = modifyHtmlContent(htmlContent, q);
            res.send(htmlContent);
        } else {
            res.send(response.data);
        }
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({
            error: 'Error fetching resource',
            details: error.message
        });
    }
});

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "api/proxy.js",
  "type": "module",
  "scripts": {
    "start": "node api/proxy.js"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "cheerio": "^1.0.0-rc.12",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}