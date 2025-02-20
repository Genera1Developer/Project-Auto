<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Project Auto Proxy</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="script.js" defer></script>
</head>

<body>
  <div class="sidebar">
    <a href="/index.html">Home</a>
    <a href="/dashboard.html">Dashboard</a>
    <a href="/settings.html">Settings</a>
  </div>
  <div class="main-content">
    <h1 class="main-title">Project Auto Proxy</h1>
    <div class="search-container">
      <input type="text" class="search-input" placeholder="Search..." />
      <button class="search-button" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M21 21l-6-6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
    <form id="login-form">
      <label for="username">Username:</label>
      <input type="text" id="username" />
      <label for="password">Password:</label>
      <input type="password" id="password" />
      <button type="submit" class="submit-button">Login</button>
    </form>
    <div id="status-indicator"></div>
    <div id="error-message"></div>
    <div id="connection-status"></div>
  </div>
</body>

</html>