file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Dashboard</title>
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
      <h1>Proxy Dashboard</h1>
      <div class="stats">
        <div class="stat">
          <h2>Real-time Connections</h2>
          <span id="connections">0</span>
        </div>
        <div class="stat">
          <h2>Bandwidth Usage</h2>
          <canvas id="bandwidth-chart"></canvas>
        </div>
        <div class="stat">
          <h2>Active Connections</h2>
          <ul id="active-connections"></ul>
        </div>
        <div class="stat">
          <h2>Error Log</h2>
          <ul id="error-log"></ul>
        </div>
        <div class="stat">
          <h2>User Statistics</h2>
          <ul id="user-stats"></ul>
        </div>
      </div>
    </div>
  </div>

  <script>
    const connections = document.querySelector('#connections');
    const bandwidthChart = document.querySelector('#bandwidth-chart');
    const activeConnections = document.querySelector('#active-connections');
    const errorLog = document.querySelector('#error-log');
    const userStats = document.querySelector('#user-stats');

    // Get real-time connection status
    const getConnections = () => {
      fetch('/api/connections')
        .then(res => res.json())
        .then(data => {
          connections.textContent = data.connections;
        })
        .catch(err => {
          console.error(err);
          errorLog.innerHTML += `<li>${err}</li>`;
        });
    };

    // Get bandwidth usage data
    const getBandwidthUsage = () => {
      fetch('/api/bandwidth')
        .then(res => res.json())
        .then(data => {
          const ctx = bandwidthChart.getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: data.timestamps,
              datasets: [{
                label: 'Bandwidth Usage',
                data: data.usage
              }]
            }
          });
        })
        .catch(err => {
          console.error(err);
          errorLog.innerHTML += `<li>${err}</li>`;
        });
    };

    // Get active connections
    const getActiveConnections = () => {
      fetch('/api/connections/active')
        .then(res => res.json())
        .then(data => {
          activeConnections.innerHTML = '';
          data.connections.forEach(connection => {
            activeConnections.innerHTML += `<li>${connection.ip} - ${connection.port}</li>`;
          });
        })
        .catch(err => {
          console.error(err);
          errorLog.innerHTML += `<li>${err}</li>`;
        });
    };

    // Get error log
    const getErrorLog = () => {
      fetch('/api/errors')
        .then(res => res.json())
        .then(data => {
          errorLog.innerHTML = '';
          data.errors.forEach(error => {
            errorLog.innerHTML += `<li>${error}</li>`;
          });
        })
        .catch(err => {
          console.error(err);
          errorLog.innerHTML += `<li>${err}</li>`;
        });
    };

    // Get user statistics
    const getUserStats = () => {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          userStats.innerHTML = '';
          data.users.forEach(user => {
            userStats.innerHTML += `<li>${user.username} - ${user.connections}</li>`;
          });
        })
        .catch(err => {
          console.error(err);
          errorLog.innerHTML += `<li>${err}</li>`;
        });
    };

    // Update dashboard every 5 seconds
    setInterval(() => {
      getConnections();
      getBandwidthUsage();
      getActiveConnections();
      getErrorLog();
      getUserStats();
    }, 5000);
  </script>
</body>
</html>
```