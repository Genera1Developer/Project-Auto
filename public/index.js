FILE PATH: public/index.js
CONTENT:
```javascript
const form = document.querySelector("form");
const responseBody = document.getElementById("response-body");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const path = document.getElementById("path").value;
  const method = document.getElementById("method").value;
  const requestBody = document.getElementById("request-body").value;

  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const { status, statusText } = response;
  const contentType = response.headers.get("Content-Type");
  const rawResponse = await response.text();
  let responseBodyContent;

  if (contentType.includes("json")) {
    responseBodyContent = JSON.stringify(JSON.parse(rawResponse), null, 2);
  } else {
    responseBodyContent = rawResponse;
  }

  responseBody.textContent = `${status} ${statusText}

  ${responseBodyContent}`;
});
```