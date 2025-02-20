file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Dashboard</title>
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
      <h1>Dashboard</h1>
      <div id="connection-status">
        <h2>Connection Status</h2>
        <p id="connection-status-text">Disconnected</p>
      </div>
      <div id="bandwidth-usage">
        <h2>Bandwidth Usage</h2>
        <canvas id="bandwidth-usage-chart"></canvas>
      </div>
      <div id="active-connections">
        <h2>Active Connections</h2>
        <ul id="active-connections-list"></ul>
      </div>
      <div id="error-log">
        <h2>Error Log</h2>
        <ul id="error-log-list"></ul>
      </div>
      <div id="user-statistics">
        <h2>User Statistics</h2>
        <ul id="user-statistics-list"></ul>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```