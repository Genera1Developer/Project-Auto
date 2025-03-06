document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.querySelector('.cyber-input');
    const goButton = document.querySelector('.cyber-button');

    goButton.addEventListener('click', function() {
        let url = urlInput.value;
        if (url) {
            window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
        } else {
            alert('Please enter a URL.');
        }
    });

    urlInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            goButton.click();
        }
    });
});