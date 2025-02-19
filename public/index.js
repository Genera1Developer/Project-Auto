FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Get the form data
  const url = event.target.querySelector("input[name='url']").value;
  const method = event.target.querySelector("select[name='method']").value;
  const body = event.target.querySelector("textarea[name='request-body']").value;

  // Create a request object
  const request = {
    url,
    method,
    body,
  };

  // Send the request to the server
  const response = await fetch("/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  // Display the response
  const responseBody = await response.text();
  document.querySelector("#response-body").textContent = responseBody;
});
```