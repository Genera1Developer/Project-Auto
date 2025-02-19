**File Structure:**

- api/proxy.js
- package.json
- README.md
- api/static/index.html

**api/proxy.js:**

```js
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("api/static"));

app.get("/proxy", async (req, res) => {
  // Add error handling for missing URL parameter
  if (!req.query.url) {
    return res.status(400).send("Missing URL parameter.");
  }

  const targetUrl = req.query.url;

  try {
    const response = await axios.get(targetUrl);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching URL.");
  }
});

app.listen(port, () => {
  console.log(`Web proxy listening on port ${port}`);
});
```

**New Files:**

**package.json:**

```json
{
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "Web proxy service for Vercel and static serverless sites",
  "main": "api/proxy.js",
  "scripts": {
    "start": "node api/proxy.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "express": "^4.18.1"
  }
}
```

**README.md:**

```
# Web Proxy Service

This service provides a web proxy for Vercel and static serverless sites. It allows you to fetch and serve content from any URL, regardless of CORS restrictions.

## Usage

To use the service, make a GET request to the `/proxy` endpoint with the following query parameter:

- `url`: The URL of the resource you want to fetch

Example:

```
GET https://example.com/proxy?url=https://example.com/api/data
```

## Features

- Supports Vercel and static serverless sites
- No CORS restrictions
- Easy to use

## Deployment

To deploy the service, follow these steps:

1. Create a new Vercel or static serverless site
2. Add the `package.json` and `api/proxy.js` files to your site
3. Deploy your site

## Contributing

Contributions are welcome! Please read the [contributing guidelines](https://github.com/example/web-proxy/blob/main/CONTRIBUTING.md) before submitting a pull request.
```

**api/static/index.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Web Proxy Service</title>
  </head>
  <body>
    <h1>Web Proxy Service</h1>
    <p>
      This service provides a web proxy for Vercel and static serverless sites. It allows you to fetch and serve content from any
      URL, regardless of CORS restrictions.
    </p>
    <h2>Usage</h2>
    <p>
      To use the service, make a GET request to the <code>/proxy</code> endpoint with the following query parameter:
    </p>
    <ul>
      <li><code>url</code>: The URL of the resource you want to fetch</li>
    </ul>
    <p>Example:</p>
    <code>GET https://example.com/proxy?url=https://example.com/api/data</code>
  </body>
</html>
```