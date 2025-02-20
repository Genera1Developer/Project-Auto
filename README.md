file path: index.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="wrapper">
    <div class="sidebar">
      <a href="/index.html">Home</a>
      <a href="/dashboard.html">Dashboard</a>
      <a href="/settings.html">Settings</a>
    </div>
    <div class="main">
      <div class="login-form">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter password">
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
      <div class="proxy-status">
        <span class="status">Status: </span>
        <span class="status-indicator"></span>
      </div>
      <div class="error-messages"></div>
      <div class="connection-status"></div>
    </div>
  </div>

  <script>
    const loginForm = document.getElementById('login-form');
    const statusIndicator = document.querySelector('.status-indicator');
    const errorMessages = document.querySelector('.error-messages');
    const connectionStatus = document.querySelector('.connection-status');

    const checkProxyStatus = () => {
      // TODO: Implement proxy status checking

      const status = 'running'; // Placeholder value

      if (status === 'running') {
        statusIndicator.classList.add('status-running');
      } else {
        statusIndicator.classList.add('status-error');
      }
    };

    const displayError = (error) => {
      errorMessages.innerHTML = `<p class="error-message">${error}</p>`;
    };

    const displayConnectionStatus = (status) => {
      connectionStatus.innerHTML = `<p class="connection-status">${status}</p>`;
    };

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: Implement login logic

      checkProxyStatus();
    });

    // Call checkProxyStatus() on page load
    window.addEventListener('load', checkProxyStatus);
  </script>
</body>
</html>
```