file: dashboard.html

content:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="./js/main.js"></script>
    <style>
        body {
            background-color: #e0f2f1;
            font-family: Arial, sans-serif;
        }

        .sidebar {
            width: 200px;
            float: left;
            background-color: #3498db;
            padding: 20px;
            border-radius: 10px;
        }

        .sidebar a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 10px;
        }

        .sidebar a:hover {
            background-color: #2980b9;
        }

        .content {
            margin-left: 220px;
        }

        .dashboard-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
        }

        .dashboard-section {
            margin-bottom: 20px;
        }

        .dashboard-section-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .dashboard-section-content {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
        }

        .connection-status {
            display: flex;
            align-items: center;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .online {
            background-color: green;
        }

        .offline {
            background-color: red;
        }

        .bandwidth-graph {
            width: 100%;
            height: 200px;
        }

        .active-connections-table {
            width: 100%;
            border-collapse: collapse;
        }

        .active-connections-table th {
            background-color: #3498db;
            color: white;
            padding: 5px;
        }

        .active-connections-table td {
            padding: 5px;
        }

        .error-log {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
        }

        .error-log-item {
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="sidebar">
        <a href="/index.html">Proxy</a>
        <a href="/settings.html">Settings</a>
        <a href="/dashboard.html">Dashboard</a>
    </div>
    <div class="content">
        <h1>Dashboard</h1>
        <p>Monitor your proxy usage and make adjustments as needed.</p>
        <div class="dashboard-container">
            <div class="dashboard-section">
                <div class="dashboard-section-title">Connection Status</div>
                <div class="dashboard-section-content">
                    <div class="connection-status">
                        <div class="status-indicator online"></div>
                        <span>Online</span>
                    </div>
                </div>
            </div>
            <div class="dashboard-section">
                <div class="dashboard-section-title">Bandwidth Usage</div>
                <div class="dashboard-section-content">
                    <canvas id="bandwidth-graph"></canvas>
                </div>
            </div>
            <div class="dashboard-section">
                <div class="dashboard-section-title">Active Connections</div>
                <div class="dashboard-section-content">
                    <table class="active-connections-table">
                        <thead>
                            <tr>
                                <th>Remote IP</th>
                                <th>Local IP</th>
                                <th>Port</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>192.168.1.1</td>
                                <td>127.0.0.1</td>
                                <td>8080</td>
                            </tr>
                            <tr>
                                <td>192.168.1.2</td>
                                <td>127.0.0.1</td>
                                <td>8081</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="dashboard-section">
                <div class="dashboard-section-title">Error Log</div>
                <div class="dashboard-section-content error-log">
                    <div class="error-log-item">
                        <span>2023-03-08 10:00:00</span>
                        <span>Error connecting to remote host</span>
                    </div>
                    <div class="error-log-item">
                        <span>2023-03-08 10:01:00</span>
                        <span>Error sending data to remote host</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
```