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
      <div class="login-form">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" name="username" id="username" placeholder="Username" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" name="password" id="password" placeholder="Password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="proxy-status">
        <h2>Proxy Status</h2>
        <div id="proxy-status"></div>
      </div>
      <div class="connection-status">
        <h2>Connection Status</h2>
        <div id="connection-status"></div>
      </div>
      <div class="error-message"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```