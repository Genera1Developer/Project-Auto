file path: index.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="wrapper">
    <div class="sidebar">
      <a href="/index.html">Home</a>
      <a href="/dashboard.html">Dashboard</a>
      <a href="/settings.html">Settings</a>
    </div>
    <div class="main">
      <div class="login-form">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter password">
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
      <div class="proxy-status">
        <h1>Proxy Status</h1>
        <span id="proxy-status-indicator"></span>
        <p id="proxy-status-message"></p>
      </div>
      <div class="connection-status">
        <h1>Connection Status</h1>
        <ul id="connection-status-list"></ul>
      </div>
    </div>
  </div>

  <script>
    // TODO: Implement login and proxy status functionality
  </script>
</body>
</html>
```