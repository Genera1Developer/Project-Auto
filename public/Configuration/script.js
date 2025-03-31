document.addEventListener('DOMContentLoaded', function() {
    // Get configuration options from local storage or default values
    let config = JSON.parse(localStorage.getItem('projectAutoConfig')) || {
        githubRepo: '',
        customInstructions: '',
        githubToken: null
    };

    // Populate the form with existing configuration
    document.getElementById('githubRepo').value = config.githubRepo;
    document.getElementById('customInstructions').value = config.customInstructions;

    // Save configuration to local storage
    document.getElementById('configForm').addEventListener('submit', function(event) {
        event.preventDefault();
        config.githubRepo = document.getElementById('githubRepo').value;
        config.customInstructions = document.getElementById('customInstructions').value;
        localStorage.setItem('projectAutoConfig', JSON.stringify(config));
        alert('Configuration saved!');
    });

    // GitHub Authentication button event
    const githubAuthButton = document.getElementById('githubAuth');
    githubAuthButton.addEventListener('click', function() {
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config;
        if (!config.githubToken) {
            window.location.href = '/api/github-auth';
        } else {
            alert('Already authenticated with GitHub.');
        }
    });

    // Check for GitHub token in local storage and update UI
    function updateAuthButton() {
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config;
        if (config.githubToken) {
            githubAuthButton.textContent = 'Authenticated';
            githubAuthButton.disabled = true;
        } else {
            githubAuthButton.textContent = 'Authenticate with GitHub';
            githubAuthButton.disabled = false;
        }
    }

    // Start button functionality
    const startButton = document.getElementById('startBtn');
    startButton.addEventListener('click', function() {
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config;
        const repo = document.getElementById('githubRepo').value;
        const instructions = document.getElementById('customInstructions').value;
        const token = config.githubToken;

        if (!repo || !instructions || !token) {
            alert('Please configure your repository, instructions, and authenticate with GitHub.');
            return;
        }

        fetch('/api/start-auto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                repo: repo,
                instructions: instructions
            })
        })
        .then(response => {
             if (!response.ok) {
                  return response.json().then(err => {throw new Error(err.message || 'Something went wrong')});
             }
             return response.json();
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred while starting Project Auto: ${error.message}`);
        });
    });

     // Function to display current time
     function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('currentTime').textContent = timeString;
    }

    // Update time every second
    setInterval(updateTime, 1000);

    // Initial time display
    updateTime();
    updateAuthButton();
    window.addEventListener('storage', updateAuthButton);

    // Add event listener for clearing the configuration
    document.getElementById('clearConfig').addEventListener('click', function() {
        localStorage.removeItem('projectAutoConfig');
        document.getElementById('githubRepo').value = '';
        document.getElementById('customInstructions').value = '';
        updateAuthButton();
        alert('Configuration cleared!');
    });
});