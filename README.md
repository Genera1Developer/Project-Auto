#e0f2f1;
    }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 200px;
      padding: 20px;
      background-color: #3498db;
      color: white;
      border-right: 1px solid #000;
    }

    .sidebar-link {
      display: block;
      margin-bottom: 10px;
      font-size: 1.2rem;
      text-decoration: none;
      color: white;
    }

    .sidebar-link:hover {
      color: #e0f2f1;
    }

    .main {
      flex: 1;
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    h1 {
      margin-top: 0;
    }

    label {
      font-weight: bold;
    }

    input {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    select {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 200px;
    }

    button {
      padding: 5px 10px;
      border: 1px solid #3498db;
      border-radius: 5px;
      background-color: #3498db;
      color: white;
    }

    button:hover {
      background-color: #e0f2f1;
      border-color: #e0f2f1;
    }

    .error {
      color: red;
    }

    .success {
      color: green;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="sidebar">
      <a href="/index.html" class="sidebar-link">Home</a>
      <a href="/settings.html" class="sidebar-link">Settings</a>
      <a href="/dashboard.html" class="sidebar-link">Dashboard</a>
    </div>
    <div class="main">
      <h1>Dashboard</h1>
      <div class="real-time-connection-status">
        <h2>Real-Time Connection Status</h2>
        <div class="status"></div>
      </div>
      <div class="bandwidth-usage-graphs">
        <h2>Bandwidth Usage Graphs</h2>
        <canvas id="bandwidth-usage-graph"></canvas>
      </div>
      <div class="active-connections">
        <h2>Active Connections</h2>
        <ul class="connections"></ul>
      </div>
      <div class="error-log">
        <h2>Error Log</h2>
        <ul class="errors"></ul>
      </div>
      <div class="user-statistics">
        <h2>User Statistics</h2>
        <ul class="statistics"></ul>
      </div>
    </div>
  </div>

  <script src="js/dashboard.js"></script>
</body>

</html>
```