FILE PATH: public/index.js
CONTENT:
```javascript
import createElement from "./dom";

const form = document.querySelector("form");
const result = document.querySelector(".result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('input[name="method"]').value;
  const body = form.querySelector('textarea[name="body"]').value;

  const requestBody =
    method === "POST" || method === "PUT"
      ? {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      : {
          method,
        };

  try {
    const response = await fetch(url, requestBody);

    if (!response.ok) {
      const error = new Error(response.statusText);
      throw error;
    }

    const responseBody = await response.text();

    const resultElement = createElement("pre", responseBody);
    result.appendChild(resultElement);
  } catch (error) {
    const errorMessage = "Error: " + error.message;
    const resultElement = createElement("pre", errorMessage);
    result.appendChild(resultElement);
  }
});
```