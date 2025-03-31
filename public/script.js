document.addEventListener('DOMContentLoaded', () => {
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
  }

  // Initial time update
  updateTime();

  // Update time every second
  setInterval(updateTime, 1000);

  // Sidebar functionality
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      content.classList.toggle('sidebar-collapsed');
    });
  }

  // Form submission handling
  const projectAutoForm = document.getElementById('project-auto-form');

  if (projectAutoForm) {
    projectAutoForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const repo = document.getElementById('repo').value;
      const prompt = document.getElementById('prompt').value;

      // Basic input validation
      if (!repo || !prompt) {
        alert('Please fill in both repository and prompt fields.');
        return;
      }

      try {
        // GitHub authentication
        const githubToken = localStorage.getItem('githubToken'); // Retrieve token
        if (!githubToken) {
          alert('Please authenticate with GitHub first.');
          window.location.href = '/public/Configuration'; // Redirect to configuration
          return;
        }

        const response = await fetch('/api/run_auto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${githubToken}`, // Include token
          },
          body: JSON.stringify({ repo, prompt }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Or display the result in a more user-friendly way
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error during Project Auto execution:', error);
        alert('An error occurred while running Project Auto. Please check the console.');
      }
    });
  }

  // GitHub authentication flow
  const githubAuthButton = document.getElementById('github-auth-button');
  if (githubAuthButton) {
    githubAuthButton.addEventListener('click', () => {
      // Redirect to GitHub OAuth flow (replace with your actual OAuth URL)
      const clientId = 'Iv1.742494741585dfa7'; // Replace with your GitHub App client ID
      const redirectUri = 'https://project-auto-v1029.vercel.app/public/Configuration'; // Replace with your redirect URI
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
      window.location.href = githubAuthUrl;
    });
  }

  // Handle the OAuth callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code && window.location.pathname === '/public/Configuration') {
    // Exchange the code for an access token (send to backend)
    fetch('/api/github_auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          // Store the access token (e.g., in localStorage)
          localStorage.setItem('githubToken', data.access_token);
          alert('GitHub authentication successful!');
          window.location.href = '/public/';
        } else {
          alert('GitHub authentication failed.');
        }
      })
      .catch((error) => {
        console.error('Error during token exchange:', error);
        alert('An error occurred during GitHub authentication.');
      });
  }

   // Handle logout
   const logoutButton = document.getElementById('logout-button');
   if (logoutButton) {
     logoutButton.addEventListener('click', () => {
       localStorage.removeItem('githubToken');
       alert('Logged out.');
       window.location.href = '/public/';
     });
   }
});
edit filepath: public/style/style.css
content: /* General Styles */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  color: #333;
  transition: all 0.3s ease; /* For sidebar transition */
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Header Styles */
.header {
  background-color: #703195;
  color: white;
  padding: 10px 0;
  text-align: center;
  border-bottom: 2px solid #FFD700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 2em;
}

#current-time {
  font-size: 1.2em;
  margin-right: 20px;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #333;
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #555;
}

.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s ease;
}

.sidebar a:hover {
  background-color: #555;
}

/* Sidebar Toggle Button */
#sidebar-toggle {
  background-color: #555;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 5px;
  z-index: 10;
}

/* Content Styles */
#content {
  margin-left: 250px;
  padding: 20px;
  transition: all 0.3s ease;
}

#content.sidebar-collapsed {
  margin-left: 60px;
}

/* Form Styles */
#project-auto-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#project-auto-form label {
  font-weight: bold;
}

#project-auto-form input[type="text"],
#project-auto-form textarea {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

#project-auto-form button {
  padding: 10px 15px;
  background-color: #703195;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#project-auto-form button:hover {
  background-color: #5a2575;
}

/* GitHub Authentication Button */
#github-auth-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

#github-auth-button:hover {
  background-color: #45a049;
}

#logout-button {
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

#logout-button:hover {
  background-color: #da190b;
}

/* Footer Styles */
footer {
  text-align: center;
  padding: 20px;
  background-color: #333;
  color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Auto</title>
  <link rel="stylesheet" href="/public/style/style.css">
</head>
<body>
  <div class="header">
    <button id="sidebar-toggle">☰</button>
    <h1>Project Auto</h1>
    <div id="current-time"></div>
  </div>

  <div class="sidebar" id="sidebar">
    <ul>
      <li><a href="/public/">Home</a></li>
      <li><a href="/public/Configuration">Configuration</a></li>
      <li><a href="/public/About-Us">About Us</a></li>
    </ul>
  </div>

  <div class="container" id="content">
    <h2>Run Project Auto</h2>
    <form id="project-auto-form">
      <label for="repo">GitHub Repository (username/repo):</label>
      <input type="text" id="repo" name="repo" required>

      <label for="prompt">Prompt:</label>
      <textarea id="prompt" name="prompt" rows="4" required></textarea>

      <button type="submit">Start</button>
    </form>
  </div>

  <footer>
    <p>&copy; 2024 Project Auto</p>
  </footer>

  <script src="/public/script.js"></script>
</body>
</html>
edit filepath: public/Configuration
content: <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Auto - Configuration</title>
  <link rel="stylesheet" href="/public/style/style.css">
</head>
<body>
  <div class="header">
    <button id="sidebar-toggle">☰</button>
    <h1>Project Auto - Configuration</h1>
    <div id="current-time"></div>
  </div>

  <div class="sidebar" id="sidebar">
    <ul>
      <li><a href="/public/">Home</a></li>
      <li><a href="/public/Configuration">Configuration</a></li>
      <li><a href="/public/About-Us">About Us</a></li>
    </ul>
  </div>

  <div class="container" id="content">
    <h2>GitHub Authentication</h2>
    <p>To use Project Auto, you need to authenticate with GitHub.</p>
    <button id="github-auth-button">Authenticate with GitHub</button>
    <button id="logout-button">Logout</button>
  </div>

  <footer>
    <p>&copy; 2024 Project Auto</p>
  </footer>

  <script src="/public/script.js"></script>
</body>
</html>
edit filepath: public/About-Us
content: <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Auto - About Us</title>
    <link rel="stylesheet" href="/public/style/style.css">
</head>
<body>
  <div class="header">
    <button id="sidebar-toggle">☰</button>
    <h1>Project Auto - About Us</h1>
    <div id="current-time"></div>
  </div>

  <div class="sidebar" id="sidebar">
    <ul>
      <li><a href="/public/">Home</a></li>
      <li><a href="/public/Configuration">Configuration</a></li>
      <li><a href="/public/About-Us">About Us</a></li>
    </ul>
  </div>

  <div class="container" id="content">
    <h2>About Project Auto</h2>
    <p>Project Auto is a tool designed to automate tasks on GitHub repositories based on user prompts.</p>
    <p>Our mission is to simplify and accelerate software development workflows.</p>
  </div>

  <footer>
    <p>&copy; 2024 Project Auto</p>
  </footer>

  <script src="/public/script.js"></script>
</body>
</html>