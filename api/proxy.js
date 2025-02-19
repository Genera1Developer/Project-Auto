**File Structure**

- `api/proxy.js`
- `package.json`
- `README.md`
- `api/static/index.html`
- `utils/error.js`
- `api/static/error.html`

**api/proxy.js:**

```js
const express = require("express");
const axios = require("axios");
const errorHandler = require("./utils/error");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("api/static"));

app.get("/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) throw errorHandler.badRequest("Missing URL parameter.");

    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    errorHandler.internalServerError(res, error);
  }
});

app.listen(port, () => {
  console.log(`Web proxy listening on port ${port}`);
});
```

**package.json:**

```json
{
  "name": "web-proxy",
  "version": "1.0.1",
  "description": "Web proxy service for Vercel and static serverless sites",
  "main": "api/proxy.js",
  "scripts": {
    "start": "node api/proxy.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "errorhandler": "^1.5.0"
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

Example request:

```
GET https://example.com/proxy?url=https://example.com/api/data
```

Possible responses:

- If the request was successful, the service will return the content of the specified URL.
- If the request failed, the service will return an error message.

## Features

- Supports Vercel and static serverless sites
- No CORS restrictions
- Easy to use

## Deployment

To deploy the service, follow these steps:

1. Create a new Vercel or static serverless site
2. Add the `package.json`, `api/proxy.js`, `api/static/index.html`, `utils/error.js`, and `api/static/error.html` files to your site
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

**utils/error.js:**

```js
const createError = require("http-errors");

const errorHandler = {
  badRequest: (message) => createError(400, message),
  internalServerError: (res, error) => {
    console.error(error);
    res.status(500).sendFile("error.html", { root: "./api/static" });
  },
};

module.exports = errorHandler;
```

**api/static/error.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Error</title>
  </head>
  <body>
    <h1>Error</h1>
    <p>
      An error occurred while fetching the URL. Please try again.
    </p>
  </body>
</html>
```

## Changes and Improvements:

- Added CORS handling using `cors` package.
- Changed the `res.header` calls to `res.send` to send the response data directly.
- Added a custom error page (`api/static/error.html`) to handle internal server errors.
- Modified `errorHandler.internalServerError` to send the custom error page instead of a plain text error message.
- Improved the error handling by using the `createError` function from the `http-errors` package.