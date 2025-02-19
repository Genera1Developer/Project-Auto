FILE PATH: client/index.js
CONTENT: 
```javascript
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('input[name="method"]').value;
  const headers = document.querySelector('input[name="headers"]').value;
  const body = document.querySelector('textarea[name="body"]').value;

  const data = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, method, headers, body }),
  }).then((res) => res.json());

  document.querySelector('pre').textContent = JSON.stringify(data, null, 2);
});
```