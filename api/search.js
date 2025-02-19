file: public/script.js
content: 
```javascript
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target.querySelector('input[name="query"]');
  fetch(`/api/search?query=${query.value}`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("iframe").srcdoc = data;
    });
});
```