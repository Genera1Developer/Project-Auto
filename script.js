<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Project Auto Proxy</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="container">
    <div class="sidebar">
      <nav>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/dashboard.html">Dashboard</a></li>
          <li><a href="/settings.html">Settings</a></li>
        </ul>
      </nav>
    </div>
    <div class="main">
      <div class="topbar">
        <h1>Project Auto Proxy</h1>
        <button class="theme-toggle" id="theme-toggle">
          <span>☀️</span>
          <span>🌙</span>
        </button>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Enter a URL">
        <button>Go</button>
      </div>
      <div class="proxy-status">
        <p>Status: Idle</p>
      </div>
      <div class="error-message"></div>
      <div class="connection-status"></div>
    </div>
  </div>
  <script src="script.js"></script>
</body>

</html>