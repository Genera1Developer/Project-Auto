document.addEventListener('DOMContentLoaded', function() {
    // Get configuration options from local storage or default values
    let config = JSON.parse(localStorage.getItem('projectAutoConfig')) || {
        githubRepo: '',
        customInstructions: '',
        githubToken: ''
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
        // Redirect to GitHub OAuth flow
        window.location.href = '/api/github-auth';
    });

    // Check for GitHub token in local storage and update UI
    if (config.githubToken) {
        document.getElementById('githubAuth').textContent = 'Authenticated';
        document.getElementById('githubAuth').disabled = true;
    }

    // Start button functionality
    document.getElementById('startBtn').addEventListener('click', function() {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repo: repo,
                instructions: instructions,
                token: token
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
});