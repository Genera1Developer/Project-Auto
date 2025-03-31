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