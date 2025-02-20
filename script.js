```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Project Auto Proxy</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="script.js" defer></script>
  </head>

  <body>
    <div class="sidebar">
      <a href="/index.html">Home</a>
      <a href="/dashboard.html">Dashboard</a>
      <a href="/settings.html">Settings</a>
    </div>
    <div class="main-content">
      <h1>Project Auto Proxy</h1>
      <form id="login-form">
        <label for="username">Username:</label>
        <input type="text" id="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" />
        <button type="submit">Login</button>
      </form>
      <div id="status-indicator"></div>
      <div id="error-message"></div>
      <div id="connection-status"></div>
    </div>
  </body>
</html>
```