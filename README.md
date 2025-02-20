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
      <h1>Web Proxy</h1>
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

      <div id="proxy-status">
        <h2>Proxy Status:</h2>
        <span id="status">Disconnected</span>
      </div>

      <div id="error-messages"></div>

      <div id="connection-status"></div>
    </div>
  </div>

  <script>
    // TODO: Implement login and proxy functionality
  </script>
</body>
</html>
```