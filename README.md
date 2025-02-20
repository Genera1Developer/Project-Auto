file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Proxy Settings</title>
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
      <h1>Proxy Settings</h1>
      <form id="proxy-settings-form">
        <div class="form-group">
          <label for="protocol">Protocol:</label>
          <select name="protocol" id="protocol">
            <option value="HTTP">HTTP</option>
            <option value="HTTPS">HTTPS</option>
          </select>
        </div>
        <div class="form-group">
          <label for="port">Port:</label>
          <input type="number" name="port" id="port" placeholder="Port" required />
        </div>
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" name="username" id="username" placeholder="Username" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" name="password" id="password" placeholder="Password" />
        </div>
        <div class="form-group">
          <label for="bandwidth-limit">Bandwidth Limit (KB/s):</label>
          <input type="number" name="bandwidth-limit" id="bandwidth-limit" placeholder="Bandwidth Limit" />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```