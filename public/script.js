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
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    contentDiv.innerHTML = data;
                })
                .catch(error => {
                    console.error('Error:', error);
                    contentDiv.innerHTML = '<p class="error">An error occurred: ' + error + '</p>';
                });
        } else {
            contentDiv.innerHTML = '<p class="error">Please enter a URL.</p>';
        }
    });
});