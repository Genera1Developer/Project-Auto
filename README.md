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
      <form>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <div id="proxy-status">
        <p>Proxy Status: <span id="status">Connecting...</span></p>
      </div>
      <div id="error-message" class="error"></div>
      <div id="connection-status"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```