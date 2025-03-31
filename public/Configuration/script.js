document.addEventListener('DOMContentLoaded', function() {
    // Get configuration options from local storage or default values
    let config = JSON.parse(localStorage.getItem('projectAutoConfig')) || {
        githubRepo: '',
        customInstructions: '',
        githubToken: null // Store token as null
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
    document.getElementById('githubAuth').addEventListener('click', function() {
        // Redirect to GitHub OAuth flow, but only if there is no token already
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config; //refresh config
        if (!config.githubToken) {
            window.location.href = '/api/github-auth';
        } else {
            alert('Already authenticated with GitHub.');
        }
    });

    // Check for GitHub token in local storage and update UI
    function updateAuthButton() {
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config; //refresh config
        if (config.githubToken) {
            document.getElementById('githubAuth').textContent = 'Authenticated';
            document.getElementById('githubAuth').disabled = true;
        } else {
            document.getElementById('githubAuth').textContent = 'Authenticate with GitHub';
            document.getElementById('githubAuth').disabled = false;
        }
    }

    // Start button functionality
    document.getElementById('startBtn').addEventListener('click', function() {
        config = JSON.parse(localStorage.getItem('projectAutoConfig')) || config; //refresh config
        const repo = document.getElementById('githubRepo').value;
        const instructions = document.getElementById('customInstructions').value;
        const token = config.githubToken;


        if (!repo || !instructions || !token) {
            alert('Please configure your repository, instructions, and authenticate with GitHub.');
            return;
        }

        // Call the backend API to start Project Auto
        fetch('/api/start-auto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token in header
            },
            body: JSON.stringify({
                repo: repo,
                instructions: instructions
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while starting Project Auto.');
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
    updateAuthButton(); // Initial button state
    window.addEventListener('storage', updateAuthButton); // Listen for changes

    // Add event listener for clearing the configuration
    document.getElementById('clearConfig').addEventListener('click', function() {
        localStorage.removeItem('projectAutoConfig');
        // Reset form values
        document.getElementById('githubRepo').value = '';
        document.getElementById('customInstructions').value = '';
        // Update auth button
        updateAuthButton();
        alert('Configuration cleared!');
    });
});