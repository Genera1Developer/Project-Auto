document.addEventListener('DOMContentLoaded', function() {
    // Function to create a matrix-style rain effect
    function matrixRain(canvasId, symbolSet, fontSize, speed, color) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const symbols = symbolSet.split("");
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Dark transparent background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color; // Green color
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = symbols[Math.floor(Math.random() * symbols.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        setInterval(draw, speed);
    }

    // Apply matrix rain effect to a canvas
    matrixRain('matrixCanvas', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+=-`', 16, 50, '#0F0');

    // Particle js initilization
    particlesJS.load('particles-js', 'particles-config.json', function() {
        console.log('particles.js loaded - callback');
    });
});
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Proxy</title>
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #000;
            color: #ddd;
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
        }

        #particles-js {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .container {
            text-align: center;
            background-color: rgba(30, 30, 30, 0.8);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
            width: 80%;
            max-width: 600px;
        }

        h1 {
            color: #fff;
            margin-bottom: 20px;
        }

        input[type="url"] {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #555;
            border-radius: 5px;
            background-color: #222;
            color: #fff;
            box-sizing: border-box;
        }

        button {
            background-color: #007bff;
            color: white;
            padding: 14px 20px;
            margin: 10px 0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        .login-link {
            color: #007bff;
            text-decoration: none;
            margin-top: 20px;
            display: block;
        }

        .login-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <canvas id="matrixCanvas"></canvas>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Secure Proxy</h1>
        <input type="url" id="urlInput" placeholder="Enter URL" />
        <button id="proxyButton">Access via Proxy</button>
        <a href="login.html" class="login-link">Login</a>
    </div>

    <script src="particles.js"></script>
    <script src="script.js"></script>
    <script>
        document.getElementById('proxyButton').addEventListener('click', function() {
            const url = document.getElementById('urlInput').value;
            // Implement proxy functionality here (e.g., redirect to proxy endpoint)
            // For example: window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
            console.log('URL to proxy:', url);
        });
    </script>
</body>
</html>