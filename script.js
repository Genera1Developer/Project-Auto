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
    <div class="light-dark-mode-toggle">
      <input type="checkbox" id="light-dark-mode-toggle-input" />
      <label for="light-dark-mode-toggle-input" class="light-dark-mode-toggle-label">
        <div class="sun">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFE169">
            <path
              d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          </svg>
        </div>
        <div class="moon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2E3133">
            <path
              d="M20 12a10.54 10.54 0 0 0-7.51-3.51A1.19 1.19 0 0 0 12 9.46V4h2v5.46a1.19 1.19 0 0 0 2.38.03A10.54 10.54 0 0 0 20 12zm0 0a9.46 9.46 0 0 1-6.5-2.51A1.19 1.19 0 0 0 12 3.46V0h2v3.46a1.19 1.19 0 0 0 2.38.03A9.46 9.46 0 0 1 20 12z" />
          </svg>
        </div>
      </label>
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