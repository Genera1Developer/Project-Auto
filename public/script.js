document.getElementById('proxyButton').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    var contentDiv = document.getElementById('content');

    if (!url) {
        contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
        return;
    }

    // Show loading message
    contentDiv.innerHTML = '<p>Loading...</p>';

    // Use Fetch API to get the content from the proxy
    fetch('/api/proxy?url=' + encodeURIComponent(url))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            // Display the content in the content div
            contentDiv.innerHTML = data;
        })
        .catch(error => {
            console.error('There has been a problem with the fetch operation:', error);
            contentDiv.innerHTML = '<p class="error">Failed to load content. Please check the URL and try again.</p>';
        });
});