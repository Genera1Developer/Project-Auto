file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Web Proxy Settings</title>
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
      <h1>Web Proxy Settings</h1>
      <form id="settings-form">
        <label for="protocol">Protocol:</label>
        <select id="protocol">
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <br />
        <label for="port">Port:</label>
        <input type="number" id="port" />
        <br />
        <label for="username">Username:</label>
        <input type="text" id="username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" />
        <br />
        <label for="bandwidth-limit">Bandwidth Limit (MB):</label>
        <input type="number" id="bandwidth-limit" />
        <br />
        <input type="submit" value="Save" />
      </form>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```