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
      <div class="status-container">
        <div class="status-item">
          <h2>Connection Status</h2>
          <span id="connection-status"></span>
        </div>
        <div class="status-item">
          <h2>Bandwidth Usage</h2>
          <canvas id="bandwidth-chart"></canvas>
        </div>
        <div class="status-item">
          <h2>Active Connections</h2>
          <ul id="active-connections"></ul>
        </div>
        <div class="status-item">
          <h2>Error Log</h2>
          <ul id="error-log"></ul>
        </div>
        <div class="status-item">
          <h2>User Statistics</h2>
          <ul id="user-statistics"></ul>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```