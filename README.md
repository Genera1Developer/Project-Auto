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
      <div class="settings-form">
        <h2>Proxy Configuration</h2>
        <form id="settings-form">
          <div class="form-group">
            <label for="protocol">Protocol:</label>
            <select name="protocol" id="protocol">
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
            </select>
          </div>
          <div class="form-group">
            <label for="port">Port:</label>
            <input type="number" name="port" id="port" placeholder="Port" required />
          </div>
          <div class="form-group">
            <label for="authentication">Authentication:</label>
            <select name="authentication" id="authentication">
              <option value="basic">Basic</option>
              <option value="digest">Digest</option>
              <option value="none">None</option>
            </select>
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
            <label for="bandwidth-limit">Bandwidth Limit (MB/s):</label>
            <input type="number" name="bandwidth-limit" id="bandwidth-limit" placeholder="Bandwidth Limit" />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Web Proxy Dashboard</title>
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
      <h1>Web Proxy Dashboard</h1>
      <div class="real-time-status">
        <h2>Real-Time Connection Status</h2>
        <div id="real-time-status"></div>
      </div>
      <div class="bandwidth-usage">
        <h2>Bandwidth Usage</h2>
        <div id="bandwidth-usage"></div>
      </div>
      <div class="active-connections">
        <h2>Active Connections</h2>
        <div id="active-connections"></div>
      </div>
      <div class="error-log">
        <h2>Error Log</h2>
        <div id="error-log"></div>
      </div>
      <div class="user-statistics">
        <h2>User Statistics</h2>
        <div id="user-statistics"></div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```