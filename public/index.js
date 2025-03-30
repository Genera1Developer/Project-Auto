<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Project Auto</title>
     <link rel="stylesheet" href="https://projectauto.com/public/style/style.css">
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
 </head>
 <body>
     <div class="sidebar">
         <h1>Project Auto</h1>
         <ul>
             <li><a href="https://github.com/Project-Auto/public/index.js"><i class="fas fa-home"></i> Home</a></li>
             <li><a href="https://github.com/Project-Auto/public/Configuration"><i class="fas fa-cog"></i> Configuration</a></li>
             <li><a href="https://github.com/Project-Auto/public/About-Us"><i class="fas fa-info-circle"></i> About Us</a></li>
         </ul>
     </div>
 
     <div class="content">
         <header>
             <div id="current-time"></div>
             <a href="https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID">
                 Login with GitHub
             </a>
         </header>
 
         <main>
             <section id="home">
                 <h2>Welcome to Project Auto</h2>
                 <p>Enter your GitHub repository and customization instructions to get started.</p>
 
                 <div class="input-form">
                     <label for="repository">GitHub Repository (username/repo):</label>
                     <input type="text" id="repository" name="repository" placeholder="e.g., owner/repo">
 
                     <label for="prompt">Customization Instructions:</label>
                     <textarea id="prompt" name="prompt" rows="4" placeholder="Enter your instructions here"></textarea>
 
                     <button id="start-button">Start</button>
                 </div>
             </section>
         </main>
     </div>
 
     <script>
         function updateTime() {
             const now = new Date();
             const timeString = now.toLocaleTimeString();
             document.getElementById('current-time').textContent = timeString;
         }
 
         setInterval(updateTime, 1000);
         updateTime();
 
         document.getElementById('start-button').addEventListener('click', function() {
            const repo = document.getElementById('repository').value;
            const prompt = document.getElementById('prompt').value;
 
            // Basic validation
            if (!repo || !prompt) {
                alert("Please enter both repository and customization instructions.");
                return;
            }
 
            // Simulate authentication with a placeholder
            const authToken = localStorage.getItem('github_token'); // Retrieve token
 
            if (!authToken) {
                alert("Please login with GitHub first.");
                return;
            }
 
            // Send data to the backend (api/process_repo.js)
            fetch('https://projectauto.com/api/process_repo.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    repository: repo,
                    prompt: prompt
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Display success or error message
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while processing your request.');
            });
        });
     </script>
 </body>
 </html>