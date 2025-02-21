file path: README.md
content: 

# Web Proxy Project

This project aims to create a structured web proxy with strictly defined files and components, featuring a baby blue, beautiful, and rounded theme.

**Allowed Files:**

- index.html (main landing page)
- settings.html (proxy configuration page)
- dashboard.html (user statistics and monitoring)
- README.md (description of the site)
- css/main.css (centralized CSS styling)
- js/main.js (centralized JavaScript)
- config.json (configuration parameters)

**Strict File Requirements:**

**1. index.html:**

- Login form with username/password fields
- Navigation to settings and dashboard
- Proxy status indicator
- Error message display area
- Connection status display
- External CSS and JS files
- Sidebar to /index.html, /dashboard.html, and /settings.html
- **Must have its own styling within the HTML**

**2. settings.html:**

- Proxy configuration form
- Protocol selection (HTTP/HTTPS)
- Port configuration
- Authentication settings
- Bandwidth limits
- Same styling as index.html
- Sidebar to /index.html, /dashboard.html, and /settings.html
- **Must have its own styling within the HTML**

**3. dashboard.html:**

- Real-time connection status
- Bandwidth usage graphs
- Active connections list
- Error log display
- User statistics
- Same styling as index.html
- Sidebar to /index.html, /dashboard.html, and /settings.html
- **Must have its own styling within the HTML**

**4. README.md:**

- Raw markdown text only

**Code Structure Rules:**

- No inline scripts or styles (except for index.html, settings.html, and dashboard.html)
- Semantic HTML elements only
- Strict content security policy
- Error handling for all operations
- Cross-browser compatibility
- Mobile responsiveness
- Clean, consistent indentation
- Proper commenting
- No external dependencies
- No framework usage

**Additional Files:**

- **css/main.css**: Centralized CSS styling for all pages
- **js/main.js**: Centralized JavaScript for all pages
- **config.json**: Configuration parameters for the proxy

**Suggested New Files:**

- **errors.html**: A dedicated error page for handling errors
- **about.html**: An optional page providing additional information about the project