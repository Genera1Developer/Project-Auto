FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector('form');
const responseBody = document.getElementById('response-body');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = document.getElementById('url').value;
  const method = document.getElementById('method').value;
  const requestBody = document.getElementById('request-body').value;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  const data = await response.json();

  responseBody.innerHTML = JSON.stringify(data, null, 2);
});
```
FILE PATH: public/style.css
CONTENT:
```css
body {
  font-family: Arial, sans-serif;
}

h1 {
  margin-top: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 10rem;
  resize: vertical;
}

#response-body {
  background-color: #f5f5f5;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```