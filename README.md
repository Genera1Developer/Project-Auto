file path: index.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Web Proxy</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="wrapper">
    <div class="sidebar">
      <a href="index.html">Home</a>
      <a href="dashboard.html">Dashboard</a>
      <a href="settings.html">Settings</a>
    </div>
    <div class="main">
      <h1>Web Proxy</h1>
      <form id="login-form">
        <label for="username">Username:</label>
        <input type="text" id="username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <div id="proxy-status">
        <h2>Proxy Status</h2>
        <p id="proxy-status-text">Idle</p>
      </div>
      <div id="error-message"></div>
      <div id="connection-status">
        <h2>Connection Status</h2>
        <p id="connection-status-text">Disconnected</p>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```