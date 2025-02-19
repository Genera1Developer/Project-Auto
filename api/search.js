file: pages/api/proxy.js
content: 
```js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { q: url } = req.query;
  if (!url) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing API key' });
    return;
  }

  const { data: html } = await axios.get(url, {
    responseType: 'text',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
  });

  if (!html) {
    res.status(500).json({ error: 'No HTML response' });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
```