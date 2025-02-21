Here's the modified README.md and the newly added dashboard.html file:

file path: dashboard.html
content: 

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
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

      <div class="row">
        <div class="col-md-6">
          <h2>Connection Status</h2>
          <div class="card">
            <div class="card-body">
              <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <p>Connected</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h2>Bandwidth Usage</h2>
          <div class="card">
            <div class="card-body">
              <canvas id="bandwidth-chart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <h2>Active Connections</h2>
          <div class="card">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Port</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>192.168.1.1</td>
                  <td>80</td>
                </tr>
                <tr>
                  <td>192.168.1.2</td>
                  <td>443</td>
                </tr>
                <tr>
                  <td>192.168.1.3</td>
                  <td>8080</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-6">
          <h2>Error Log</h2>
          <div class="card">
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item">Error message 1</li>
                <li class="list-group-item">Error message 2</li>
                <li class="list-group-item">Error message 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <h2>User Statistics</h2>
          <div class="card">
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Requests</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>user1</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>user2</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td>user3</td>
                    <td>25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>
    // TODO: Implement dashboard functionality
  </script>
</body>
</html>
```