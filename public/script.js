document.addEventListener('DOMContentLoaded', () => {
  // Particleground
  const particleground = new particleground(document.getElementById('particles'), {
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa',
    particleRadius: 5,
    lineWidth: 2,
    curvedLines: true,
    proximity: 150,
    density: 8000,
    parallax: true,
    parallaxMultiplier: 5,
    onInit: function() {},
    onDestroy: function() {}
  });

  // Form submission (example - adapt to your actual proxy logic)
  const form = document.getElementById('urlForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = document.getElementById('urlInput').value;

    // Encryption placeholder - replace with actual encryption logic
    const encryptedUrl = btoa(url); // Base64 "encryption" - replace!

    // Redirect to proxy endpoint (adapt to your server setup)
    window.location.href = '/proxy?url=' + encryptedUrl;
  });
});
edit filepath: public/index.css
content: body {
    margin: 0;
    font-family: sans-serif;
    background-color: #222;
    color: #fff;
    overflow: hidden; /* Hide scrollbars */
}

#particles {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
}

.container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

h1 {
    font-size: 3em;
    margin-bottom: 20px;
}

input[type="text"] {
    padding: 10px;
    font-size: 1em;
    border: 2px solid #5cbdaa;
    border-radius: 5px;
    width: 300px;
    background-color: #333;
    color: #fff;
}

button {
    padding: 10px 20px;
    font-size: 1em;
    background-color: #5cbdaa;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #4cae96;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Proxy</title>
    <link rel="stylesheet" href="public/index.css">
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>
<body>
    <div id="particles"></div>
    <div class="container">
        <h1>Encrypted Proxy</h1>
        <form id="urlForm">
            <input type="text" id="urlInput" placeholder="Enter URL">
            <button type="submit">Go</button>
        </form>
    </div>
  <script src="public/script.js"></script>
</body>
</html>