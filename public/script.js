document.addEventListener('DOMContentLoaded', function() {
  // Particles.js initialization (assuming particles.js is included)
  particlesJS.load('particles-js', 'particles.json', function() {
    console.log('particles.json loaded...');
  });

  const form = document.getElementById('proxy-form');
  const urlInput = document.getElementById('url-input');
  const frame = document.getElementById('proxy-frame');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    let url = urlInput.value;

    // Basic URL validation (improve this with a more robust check)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url; // Default to http if no protocol specified
    }

    // Encryption-themed loading animation (replace with actual encryption logic later)
    frame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent('<body style="background-color:#000; color:#0F0; font-family: monospace; font-size: 20px; display: flex; justify-content: center; align-items: center; height: 100vh;">Encrypting...</body>');

    // Simulate encryption delay (replace with actual encryption process)
    setTimeout(() => {
      //frame.src = __uv$config.prefix + __uv$config.encodeUrl(url); //uncomment to use ultraviolet
      frame.src = '/api/proxy?url=' + encodeURIComponent(url);
    }, 2000); // Simulate 2 seconds encryption time
  });

  // Error handling for iframe loading
  frame.addEventListener('error', function(event) {
    console.error('Failed to load URL:', event);
    frame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent('<body style="background-color:#F00; color:#FFF; font-family: sans-serif; padding: 20px;"><h1>Error</h1><p>Failed to load the requested URL.</p></body>');
  });
});