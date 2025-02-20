file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Proxy Dashboard</title>
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
      <h1>Proxy Dashboard</h1>
      <div class="row">
        <div class="col">
          <h2>Real-time Connection Status</h2>
          <div id="connection-status"></div>
        </div>
        <div class="col">
          <h2>Bandwidth Usage Graphs</h2>
          <div id="bandwidth-usage-graphs"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h2>Active Connections</h2>
          <div id="active-connections"></div>
        </div>
        <div class="col">
          <h2>Error Log</h2>
          <div id="error-log"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h2>User Statistics</h2>
          <div id="user-statistics"></div>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```