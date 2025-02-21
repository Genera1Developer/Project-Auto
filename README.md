file path: index.html
content:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Proxy</title>
  <link rel="stylesheet" href="css/style.css" />
</head>

<body>
  <div class="container">
    <div class="sidebar">
      <a href="/index.html" class="sidebar-link">Home</a>
      <a href="/settings.html" class="sidebar-link">Settings</a>
      <a href="/dashboard.html" class="sidebar-link">Dashboard</a>
    </div>
    <div class="main">
      <h1>Login</h1>
      <form action="#">
        <label for="username">Username:</label>
        <input type="text" name="username" id="username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <div class="status">
        <p>Proxy Status: </p>
        <span id="status-indicator"></span>
      </div>
      <div class="messages">
        <p id="error-message"></p>
      </div>
      <div class="connection">
        <p>Connection Status: </p>
        <span id="connection-status"></span>
      </div>
    </div>
  </div>

  <script src="js/main.js"></script>
</body>

</html>
```