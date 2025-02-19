FILE PATH: public/script.js
CONTENT: 
```javascript
const urlInput = document.querySelector('input[name="url"]');
const submitButton = document.querySelector('input[type="submit"]');

submitButton.addEventListener('click', e => {
  e.preventDefault();

  const url = urlInput.value;

  if (!url) {
    alert('Please enter a URL.');
    return;
  }

  // Send the URL to the server to be proxied.
  fetch('/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
    .then(res => res.json())
    .then(data => {
      // Display the proxied content in the browser.
      document.body.innerHTML = data.content;
    })
    .catch(err => {
      alert('An error occurred while proxying the URL.');
      console.error(err);
    });
});
```