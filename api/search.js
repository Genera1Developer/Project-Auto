api/search.js can be improved by:

- Adding a check to ensure the output type is set to 'html' when making the API call, as HTML is required to be correctly parsed.
- Using a Transform stream to modify the HTML response, rewriting any relative URLs in the response to use `/api/proxy.js` as a proxy and preserve static assets.
- Flushing the Transform stream to append the closing HTML tags.

### File Structure

```
├── api
│   ├── proxy.js
│   ├── search.js
├── README.md
```