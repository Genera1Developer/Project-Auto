```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Project Auto Proxy</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="container">
    <div class="sidebar">
      <nav>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/dashboard.html">Dashboard</a></li>
          <li><a href="/settings.html">Settings</a></li>
        </ul>
      </nav>
    </div>
    <div class="main">
      <form id="login-form">
        <h1>Project Auto Proxy</h1>
        <label for="username">Username</label>
        <input type="text" id="username" />
        <label for="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Login</button>
      </form>
      <div id="proxy-status"></div>
      <div id="error-message"></div>
      <div id="connection-status"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>

</html>
```