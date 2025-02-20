```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Project Auto Proxy</title>
  <link rel="stylesheet" href="./styles.css" />
</head>

<body>
  <div class="container ocean-blue">
    <div class="sidebar">
      <ul>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./dashboard.html">Dashboard</a></li>
        <li><a href="./settings.html">Settings</a></li>
        <li>
          <div class="toggle-container">
            <span class="toggle-label">Mode:</span>
            <label class="toggle-switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </li>
      </ul>
    </div>

    <div class="main">
      <div class="header">
        <h1>Project Auto Proxy</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search" />
          <button type="button"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <div class="status-bar">
        <span class="proxy-status">Disconnected</span>
        <span class="connection-status">No connection</span>
      </div>

      <div class="error-container"></div>

      <div class="form-container">
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username" />
          <label for="password">Password:</label>
          <input type="password" id="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </div>

  <script src="./script.js"></script>
</body>

</html>
```