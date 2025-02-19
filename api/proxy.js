**README.md**

**File Structure:**

1. **README.md**: Project documentation and explanations.
2. **api/proxy.js**: Web proxy logic and request handling.
3. **api/proxy-socket.js**: WebSocket proxy logic.
4. **package.json**: Project dependencies and configuration.
5. **public/index.html**: Static index page for Vercel/static serverless hosting.

**Project Goal:**
- Modify the given web proxy to work fully for Vercel and static serverless sites.
- Fix any bugs encountered along the way.
- Ensure that multiple files are created to properly structure the project.

**File: api/proxy.js**

**Improvements:**

- Optimized code for static site hosting:
  - Modified the `Accept-Language` header to fix issues with serving HTML content from static sites.
- Added error handling for `content-type` parsing:
  - Included a try-catch block to handle potential errors when parsing the `content-type` header.
- Fixed issues with image loading:
  - Adjusted the URL replacement logic to correctly handle image URLs in HTML and CSS.
- Ensured proper handling of `GET` requests:
  - Added a `GET *` route to serve the static index page for Vercel/static serverless hosting.

**File: api/proxy-socket.js**

**New File:**

This file was added to provide WebSocket proxy functionality for the proxy.

**Code Snippets:**

```javascript
// api/proxy.js
// ...
// Modifications for static site hosting
res.setHeader("Accept-Language", "*");

// Error handling for content-type parsing
try {
  contentType = JSON.parse(contentType);
} catch (error) {
  contentType = "text/plain";
}

// Handling of GET requests
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
```

```javascript
// api/proxy-socket.js
const websocket = require("ws");

const server = new websocket.Server({
  // ...
});

server.on("connection", (ws, req) => {
  // ...
});
```

**Additional Explanation:**

To ensure the proxy works fully for Vercel and static serverless sites, the following changes were made:

- The `Accept-Language` header was set to `*` to allow the proxy to serve HTML content correctly.
- Error handling was added for parsing the `content-type` header to prevent crashes in case of malformed headers.
- Image loading issues were resolved by correctly handling image URLs in HTML and CSS.
- A `GET *` route was added to serve the static index page when the proxy receives a `GET` request.

Additionally, a WebSocket proxy was implemented in the new `api/proxy-socket.js` file to handle WebSocket connections within the proxy.