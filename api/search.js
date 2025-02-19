FILE PATH: public/index.html
CONTENT: 
```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Proxy</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input {
      width: 100%;
      padding: 5px;
      border: 1px solid #ccc;
    }
    button {
      padding: 5px;
      background-color: #000;
      color: #fff;
      border: none;
    }
    .results {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .result {
      border: 1px solid #ccc;
      padding: 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Web Proxy</h1>
  <form id="form">
    <label for="query">Query:</label>
    <input type="text" id="query">
    <button type="submit">Search</button>
  </form>
  <div class="results" id="results"></div>
  <script>
    const form = document.getElementById('form');
    const results = document.getElementById('results');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const query = document.getElementById('query').value;

      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      results.innerHTML = '';

      data.items.forEach((item) => {
        const result = document.createElement('div');
        result.classList.add('result');
        result.innerHTML = `
          <h3><a href="${item.link}">${item.title}</a></h3>
          <p>${item.snippet}</p>
        `;

        results.appendChild(result);
      });
    });
  </script>
</body>
</html>
```