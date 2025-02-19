Based on the project goal, here is the file:

FILE PATH: views/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="/static/style.css" />
  </head>

  <body>
    <h1>Web Proxy</h1>
    <form action="/api/search">
      <input type="text" name="q" placeholder="Search" />
      <input type="submit" value="Search" />
    </form>

    <div id="results"></div>

    <script src="/static/script.js"></script>
  </body>
</html>
```

Based on the project goal, here is the file:

FILE PATH: static/style.css
CONTENT: 
```css
body {
  font-family: sans-serif;
}

h1 {
  margin-bottom: 1em;
}

form {
  margin-bottom: 1em;
}

input[type="text"] {
  width: 100%;
  padding: 0.5em;
  margin-bottom: 0.5em;
}

input[type="submit"] {
  padding: 0.5em;
}

#results {
  max-width: 600px;
}

#results p {
  margin-bottom: 1em;
}
```

Based on the project goal, here is the file:

FILE PATH: static/script.js
CONTENT: 
```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const q = e.target.querySelector("input[name=q]").value;

  fetch(`/api/search?q=${q}`)
    .then((res) => res.json())
    .then((data) => {
      const results = document.getElementById("results");

      results.innerHTML = "";

      data.results.forEach((result) => {
        const p = document.createElement("p");
        p.innerHTML = `<a href="${result.link}">${result.title}</a>`;

        results.appendChild(p);
      });
    });
});
```