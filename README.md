file path: README.md
content:

**Web Proxy Project**

**Allowed Files:**

- index.html (main landing page)
- settings.html (proxy configuration page)
- dashboard.html (user statistics and monitoring)
- styles.css (CSS styling for all pages)
- scripts.js (JavaScript for all pages)
- background.js (background proxy script)
- README.md (description of the site)

**Strict File Requirements:**

**1. index.html:**

- Login form with username/password fields
- Navigation to settings and dashboard using JavaScript
- Proxy status indicator
- Error message display area
- Connection status display
- Sidebar to /index.html, /dashboard.html, and /settings.html using JavaScript
- Must have its own CSS styling within the HTML
- Must have its own javascript within the HTML

**2. settings.html:**

- Proxy configuration form using JavaScript
- Protocol selection (HTTP/HTTPS)
- Port configuration
- Authentication settings
- Bandwidth limits
- Sidebar to /index.html, /dashboard.html, and /settings.html using JavaScript
- Must have its own CSS styling within the HTML
- Must have its own javascript within the HTML

**3. dashboard.html:**

- Real-time connection status using JavaScript
- Bandwidth usage graphs using JavaScript
- Active connections list using JavaScript
- Error log display using JavaScript
- User statistics using JavaScript
- Sidebar to /index.html, /dashboard.html, and /settings.html using JavaScript
- Must have its own CSS styling within the HTML
- Must have its own javascript within the HTML

**4. styles.css:**

- Baby blue and rounded theming for all pages

**5. scripts.js:**

- JavaScript for login, proxy configuration, dashboard management, and sidebar navigation
- Must also handle error handling and cross-browser compatibility

**6. background.js:**

- Proxy server logic including initialization, connection handling, and data forwarding

**Code Structure Rules:**

- No inline scripts or styles
- Semantic HTML elements only
- Strict content security policy
- Error handling for all operations
- Cross-browser compatibility
- Mobile responsiveness
- Clean, consistent indentation
- Proper commenting
- No external dependencies
- No framework usage

**Additional Notes:**

- The sidebar should be present on all pages for easy navigation.
- The proxy server should be implemented using the WebSockets API.
- The user interface should be intuitive and user-friendly.