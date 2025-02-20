file path: settings.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy - Settings</title>
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
      <h1>Web Proxy - Settings</h1>
      <div class="settings-form">
        <form id="settings-form">
          <div class="field">
            <label for="protocol">Protocol</label>
            <select name="protocol" required>
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
            </select>
          </div>
          <div class="field">
            <label for="port">Port</label>
            <input type="number" name="port" required>
          </div>
          <div class="field">
            <label for="auth_enabled">Authentication</label>
            <input type="checkbox" name="auth_enabled">
          </div>
          <div class="field">
            <label for="username">Username</label>
            <input type="text" name="username" disabled>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input type="password" name="password" disabled>
          </div>
          <div class="field">
            <label for="bandwidth_limit">Bandwidth Limit (MB/s)</label>
            <input type="number" name="bandwidth_limit">
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  </div>

  <script>
    const settingsForm = document.querySelector('#settings-form');
    const authEnabled = document.querySelector('#auth_enabled');
    const username = document.querySelector('input[name="username"]');
    const password = document.querySelector('input[name="password"]');

    authEnabled.addEventListener('change', () => {
      username.disabled = !authEnabled.checked;
      password.disabled = !authEnabled.checked;
    });

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(settingsForm);

      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(data)),
      };

      fetch('/api/settings', settings)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Settings saved successfully');
          } else {
            alert('Failed to save settings');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Failed to save settings');
        });
    });
  </script>
</body>
</html>
```

file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy - Dashboard</title>
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
      <h1>Web Proxy - Dashboard</h1>
      <div class="real-time-status">
        <h2>Real-Time Status</h2>
        <ul>
          <li>Connections: <span id="connections"></span></li>
          <li>Bandwidth Usage: <span id="bandwidth"></span></li>
        </ul>
      </div>
      <div class="bandwidth-graphs">
        <h2>Bandwidth Graphs</h2>
        <canvas id="bandwidth-chart"></canvas>
      </div>
      <div class="active-connections">
        <h2>Active Connections</h2>
        <table id="active-connections-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Port</th>
              <th>Protocol</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="error-log">
        <h2>Error Log</h2>
        <div id="error-log"></div>
      </div>
      <div class="user-statistics">
        <h2>User Statistics</h2>
        <ul>
          <li>Total Users: <span id="total-users"></span></li>
          <li>Active Users: <span id="active-users"></span></li>
        </ul>
      </div>
    </div>
  </div>

  <script>
    const connections = document.querySelector('#connections');
    const bandwidth = document.querySelector('#bandwidth');
    const bandwidthChart = document.querySelector('#bandwidth-chart');
    const activeConnectionsTable = document.querySelector('#active-connections-table');
    const errorLog = document.querySelector('#error-log');
    const totalUsers = document.querySelector('#total-users');
    const activeUsers = document.querySelector('#active-users');

    let ctx = bandwidthChart.getContext('2d');
    let bandwidthChartData = {
      labels: [],
      datasets: [{
        label: 'Bandwidth Usage',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
    let bandwidthChartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    let bandwidthChartInstance = new Chart(ctx, {
      type: 'line',
      data: bandwidthChartData,
      options: bandwidthChartOptions
    });

    function updateDashboardData() {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(data => {
          connections.textContent = data.connections;
          bandwidth.textContent = `${data.bandwidth} MB/s`;
          bandwidthChartData.labels = data.bandwidth_history.map(entry => entry.date);
          bandwidthChartData.datasets[0].data = data.bandwidth_history.map(entry => entry.bandwidth);
          bandwidthChartInstance.update();
          activeConnectionsTable.querySelector('tbody').innerHTML = data.active_connections.map(connection => `
            <tr>
              <td>${connection.ip}</td>
              <td>${connection.port}</td>
              <td>${connection.protocol}</td>
              <td>${connection.duration}</td>
            </tr>
          `).join('');
          errorLog.innerHTML = data.error_log.map(entry => `<p>${entry}</p>`).join('');
          totalUsers.textContent = data.total_users;
          activeUsers.textContent = data.active_users;
        })
        .catch(err => {
          console.error(err);
          alert('Failed to update dashboard data');
        });
    }

    setInterval(updateDashboardData, 1000);
  </script>
</body>
</html>
```