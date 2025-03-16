document.getElementById('proxyButton').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    var contentDiv = document.getElementById('content');

    // Basic URL validation (improve as needed)
    if (!url) {
        contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
        return;
    }

    // Display loading message
    contentDiv.innerHTML = '<p>Loading...</p>';

    // Use a more robust encoding method to handle special characters in the URL
    var encodedUrl = encodeURIComponent(url);

    // Fetch content from the proxy endpoint (replace with your actual endpoint)
    fetch('/api/proxy?url=' + encodedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            // Display the proxied content
            contentDiv.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching content:', error);
            contentDiv.innerHTML = '<p class="error">Error: ' + error.message + '</p>';
        });
});