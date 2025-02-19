Based on the project goal, following file should be created:

FILE PATH: public/js/script.js
CONTENT: 
```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = event.target.querySelector('input[name="query"]').value;

  // Send the query to the server
  fetch('/search', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  .then(res => res.json())
  .then(data => {
    // Display the search results
    const results = document.querySelector('ul#results');
    results.innerHTML = '';

    data.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${item.link}">${item.title}</a>
        <p>${item.snippet}</p>
      `;

      results.appendChild(li);
    });
  })
  .catch(err => {
    console.error(err);
  });
});
```