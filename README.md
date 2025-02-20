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
      <h1>Dashboard</h1>
      <div class="dashboard-container">
        <div class="status-card">
          <div class="status-head">
            <h2>Connection Status</h2>
          </div>
          <div class="status-body">
            <p>Active connections: <span id="active-connections">0</span></p>
            <p>Total requests: <span id="total-requests">0</span></p>
            <p>Total bandwidth used: <span id="total-bandwidth">0 MB</span></p>
          </div>
        </div>
        <div class="graph-card">
          <div class="graph-head">
            <h2>Bandwidth Usage</h2>
          </div>
          <div class="graph-body">
            <canvas id="bandwidth-graph"></canvas>
          </div>
        </div>
        <div class="active-connections-card">
          <div class="active-connections-head">
            <h2>Active Connections</h2>
          </div>
          <div class="active-connections-body">
            <ul id="active-connections-list">
            </ul>
          </div>
        </div>
        <div class="error-log-card">
          <div class="error-log-head">
            <h2>Error Log</h2>
          </div>
          <div class="error-log-body">
            <ul id="error-log-list">
            </ul>
          </div>
        </div>
        <div class="user-statistics-card">
          <div class="user-statistics-head">
            <h2>User Statistics</h2>
          </div>
          <div class="user-statistics-body">
            <p>Total users: <span id="total-users">0</span></p>
            <p>Total requests: <span id="total-user-requests">0</span></p>
            <p>Total bandwidth used: <span id="total-user-bandwidth">0 MB</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const activeConnectionsSpan = document.getElementById('active-connections');
    const totalRequestsSpan = document.getElementById('total-requests');
    const totalBandwidthSpan = document.getElementById('total-bandwidth');
    const activeConnectionsList = document.getElementById('active-connections-list');
    const errorLogList = document.getElementById('error-log-list');
    const totalUsersSpan = document.getElementById('total-users');
    const totalUserRequestsSpan = document.getElementById('total-user-requests');
    const totalUserBandwidthSpan = document.getElementById('total-user-bandwidth');
    const bandwidthGraph = document.getElementById('bandwidth-graph');

    let activeConnections = 0;
    let totalRequests = 0;
    let totalBandwidth = 0;
    let connectedClients = [];
    let errorLog = [];
    let totalUsers = 0;
    let totalUserRequests = 0;
    let totalUserBandwidth = 0;

    const ctx = bandwidthGraph.getContext('2d');
    const bandwidthData = {
      labels: [],
      datasets: [{
        label: 'Bandwidth',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
      }]
    };

    const bandwidthChart = new Chart(ctx, {
      type: 'line',
      data: bandwidthData,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    function updateDashboard() {
      activeConnectionsSpan.textContent = activeConnections;
      totalRequestsSpan.textContent = totalRequests;
      totalBandwidthSpan.textContent = `${totalBandwidth.toFixed(2)} MB`;

      while (activeConnectionsList.firstChild) {
        activeConnectionsList.removeChild(activeConnectionsList.firstChild);
      }

      for (const client of connectedClients) {
        const li = document.createElement('li');
        li.textContent = client.ip;
        activeConnectionsList.appendChild(li);
      }

      while (errorLogList.firstChild) {
        errorLogList.removeChild(errorLogList.firstChild);
      }

      for (const error of errorLog) {
        const li = document.createElement('li');
        li.textContent = error;
        errorLogList.appendChild(li);
      }

      totalUsersSpan.textContent = totalUsers;
      totalUserRequestsSpan.textContent = totalUserRequests;
      totalUserBandwidthSpan.textContent = `${totalUserBandwidth.toFixed(2)} MB`;

      bandwidthData.labels.push(new Date().toLocaleTimeString());
      bandwidthData.datasets[0].data.push(totalBandwidth);
      bandwidthChart.update();
    }

    setInterval(updateDashboard, 1000);
  </script>
</body>
</html>
```