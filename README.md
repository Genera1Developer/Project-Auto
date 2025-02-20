file path: dashboard.html
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
      <h1 class="title">Dashboard</h1>
      <div class="stats">
        <div class="stat">
          <div class="stat-label">Connections</div>
          <div class="stat-value">0</div>
        </div>
        <div class="stat">
          <div class="stat-label">Bandwith usage</div>
          <div class="stat-value">0MB</div>
        </div>
        <div class="stat">
          <div class="stat-label">Average response time</div>
          <div class="stat-value">0ms</div>
        </div>
      </div>
      <div class="logs">
        <h2 class="log-title">Logs</h2>
        <ul class="log-list"></ul>
      </div>
    </div>
  </div>

  <script>
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Connected to dashboard');
    };

    socket.onclose = () => {
      console.error('Disconnected from dashboard');
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'stats') {
        updateStats(data.stats);
      } else if (data.type === 'log') {
        addLog(data.log);
      }
    };

    function updateStats(stats) {
      const connections = document.querySelector('.stat-value:nth-of-type(1)');
      const bandwidth = document.querySelector('.stat-value:nth-of-type(2)');
      const responseTime = document.querySelector('.stat-value:nth-of-type(3)');

      connections.innerText = stats.connections;
      bandwidth.innerText = stats.bandwidth + 'MB';
      responseTime.innerText = stats.responseTime + 'ms';
    }

    function addLog(log) {
      const logList = document.querySelector('.log-list');

      const logItem = document.createElement('li');
      logItem.innerText = log;

      logList.appendChild(logItem);
    }
  </script>
</body>
</html>
```

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
      <h1 class="title">Web Proxy</h1>
      <div class="form">
        <form id="login-form">
          <div class="field">
            <label for="username">Username</label>
            <input type="text" name="username" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="proxy-status">
        <div class="status-icon">
          <i class="fa fa-circle-o"></i>
        </div>
        <div class="status-text">
          Proxy is offline
        </div>
      </div>
      <div class="error-messages"></div>
      <div class="connection-status">
        <div class="connection-indicator">
          <div class="indicator-inner"></div>
        </div>
        <div class="connection-text">
          Not connected
        </div>
      </div>
    </div>
  </div>

  <script>
    const loginForm = document.querySelector('#login-form');
    const statusIcon = document.querySelector('.status-icon');
    const statusText = document.querySelector('.status-text');
    const connectionIndicator = document.querySelector('.connection-indicator');
    const connectionText = document.querySelector('.connection-text');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(loginForm);

      const login = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(data)),
      };

      fetch('/api/login', login)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            statusIcon.classList.remove('fa-circle-o');
            statusIcon.classList.add('fa-check-circle');
            statusText.innerText = 'Proxy is online';

            connectionIndicator.classList.add('connected');
            connectionText.innerText = 'Connected';
          } else {
            alert('Login failed');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Failed to login');
        });
    });
  </script>
</body>
</html>
```

file path: style.css
content: 

```css
/* Reset styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
}

/* Site-wide styles */

.wrapper {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #333;
  color: #fff;
}

.sidebar a {
  display: block;
  padding: 16px;
  text-decoration: none;
}

.sidebar a:hover {
  background-color: #444;
}

.main {
  flex-grow: 1;
  background-color: #f5f5f5;
}

.title {
  margin-bottom: 16px;
  font-size: 24px;
}

.form {
  max-width: 300px;
  margin: 0 auto;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 4px;
}

.field input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
}

.field input:focus {
  border-color: #444;
}

.field button {
  width: 100%;
  padding: 8px;
  background-color: #333;
  color: #fff;
  border: none;
}

.field button:hover {
  background-color: #444;
}

.error-messages {
  color: #f00;
}

.proxy-status {
  margin-top: 16px;
}

.status-icon {
  font-size: 24px;
}

.status-icon i {
  color: #f00;
}

.status-text {
  margin-left: 8px;
}

.connection-status {
  margin-top: 16px;
}

.connection-indicator {
  width: 16px;
  height: 16px;
  background-color: #f00;
  border-radius: 50%;
  animation: pulse 1s infinite;
}