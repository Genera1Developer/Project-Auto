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
          <input type="text" name="username" id="username" placeholder="Username" required />
          <input type="password" name="password" id="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="proxy-status">
        <h2>Proxy Status</h2>
        <span id="proxy-status"></span>
      </div>
      <div class="error-message" style="display: none;"></div>
      <div class="connection-status" style="display: none;"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```