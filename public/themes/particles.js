FILE PATH: public/index.html
CONTENT: ```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="/themes/particles.css">
  <script src="/themes/particles.js"></script>
</head>
<body>
  <div id="particles-js"></div>
  <script>
    particlesJS.load('particles-js', 'themes/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
  </script>
</body>
</html>
```