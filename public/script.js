document.addEventListener('DOMContentLoaded', () => {
    // Function to update the current time
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('current-time').textContent = timeString;
    }

    // Update the time every second
    setInterval(updateTime, 1000);

    // Initial time update
    updateTime();

    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetUrl = this.getAttribute('href');
                loadPage(targetUrl);
            });
        });
    }

    // Load initial page content (default to home)
    loadPage('/');

    // Function to load page content dynamically
    function loadPage(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;
                // Re-attach event listeners after content is loaded
                if (url === '/') {
                    setupHomePage();
                } else if (url === '/Configuration') {
                    setupConfigurationPage();
                } else if (url === '/About-Us') {
                    setupAboutUsPage();
                }
                updateTime(); // Ensure time is updated after page load
            })
            .catch(error => {
                console.error("Error fetching page:", error);
                document.getElementById('content').innerHTML = `<p>Error loading page.</p>`;
            });
    }

    function setupHomePage() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                authenticateAndRun();
            });
        }
    }

    function setupConfigurationPage() {
        // Implement dynamic configuration loading and saving here
        console.log("Configuration page setup");
        // Load configuration from local storage
        const accessToken = localStorage.getItem('github_access_token');
        const tokenDisplay = document.getElementById('access-token-display');

        if (tokenDisplay) {
            tokenDisplay.textContent = accessToken ? 'Authenticated' : 'Not Authenticated';
        }

        const saveTokenButton = document.getElementById('save-token-button');
        if (saveTokenButton) {
            saveTokenButton.addEventListener('click', () => {
                const newToken = document.getElementById('github-token-input').value;
                if (newToken) {
                    localStorage.setItem('github_access_token', newToken);
                    tokenDisplay.textContent = 'Authenticated';
                    alert('Token saved!');
                } else {
                    alert('Please enter a token.');
                }
            });
        }
    }

    function setupAboutUsPage() {
        // Implement dynamic content loading if needed
        console.log("About Us page setup");
    }

    function authenticateAndRun() {
        // Check if access token exists
        let accessToken = localStorage.getItem('github_access_token');

        if (!accessToken) {
            // Redirect to GitHub OAuth flow
            window.location.href = '/api/auth/github';
            return;
        }

        const repoName = document.getElementById('repo-name').value;
        const promptText = document.getElementById('prompt-text').value;

        if (repoName && promptText) {
            runProjectAuto(repoName, promptText, accessToken);
        } else {
            alert("Please enter both repository name and prompt text.");
        }
    }

    // Function to execute Project Auto
    function runProjectAuto(repoName, promptText, accessToken) {
        console.log("Running Project Auto on:", repoName, "with prompt:", promptText);
        // Make API call to backend to start Project Auto
        fetch('/api/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Pass access token
            },
            body: JSON.stringify({
                repo: repoName,
                prompt: promptText
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Project Auto response:", data);
            alert("Project Auto started. Check console for details.");
        })
        .catch(error => {
            console.error("Error running Project Auto:", error);
            alert("Error running Project Auto. Check console for details.");
        });
    }
});