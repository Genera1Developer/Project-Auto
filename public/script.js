document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const proxyButton = document.getElementById('proxyButton');
    const contentDiv = document.getElementById('content');

    proxyButton.addEventListener('click', function() {
        const url = urlInput.value;
        if (url) {
            fetch('/api/proxy?url=' + encodeURIComponent(url))
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error fetching content:', error);
                    contentDiv.innerHTML = '<div class="error">Error: Unable to fetch content. Please check the URL and try again.</div>';
                });
        } else {
            contentDiv.innerHTML = '<div class="error">Please enter a URL.</div>';
        }
    });
});