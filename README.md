file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Settings</title>
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
      <h1>Settings</h1>
      <form>
        <label for="protocol">Protocol:</label>
        <select id="protocol" name="protocol">
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
        </select>
        <br />
        <label for="port">Port:</label>
        <input type="number" id="port" name="port" placeholder="Enter the port number" />
        <br />
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" />
        <br />
        <label for="bandwidth-limit">Bandwidth Limit (MB/s):</label>
        <input type="number" id="bandwidth-limit" name="bandwidth-limit" placeholder="Enter the bandwidth limit" />
        <br />
        <input type="submit" value="Save" />
      </form>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```