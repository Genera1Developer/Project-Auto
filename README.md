# Structured Web Proxy Project Architecture

## Files and Components

- **index.html** - Main landing page
- **styles.css** - Single stylesheet for all pages
- **script.js** - Single JavaScript file for all functionality
- **settings.html** - Proxy configuration page
- **dashboard.html** - User statistics and monitoring

## File Requirements

### index.html

- Login form with username/password fields
- Navigation to settings and dashboard
- Proxy status indicator
- Error message display area
- Connection status display
- External CSS and JS files
- Sidebar with links to /index.html, /dashboard.html, and /settings.html

### styles.css

- CSS only (no preprocessors)
- Mobile-first responsive design
- Color scheme variables
- Component class naming
- Consistent styling across all pages

### script.js

- ES6+ JavaScript
- Modular function organization
- Error handling
- Proxy connection management
- User authentication logic
- Settings management
- No external libraries

### settings.html

- Proxy configuration form
- Protocol selection (HTTP/HTTPS)
- Port configuration
- Authentication settings
- Bandwidth limits
- Shared styling with index.html
- Sidebar with links to /index.html, /dashboard.html, and /settings.html

### dashboard.html

- Real-time connection status
- Bandwidth usage graphs
- Active connections list
- Error log display
- User statistics
- Shared styling with index.html
- Sidebar with links to /index.html, /dashboard.html, and /settings.html