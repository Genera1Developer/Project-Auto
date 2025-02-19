FILE PATH: public/index.js
CONTENT:
```javascript
import fetch from "node-fetch";
import { createElement } from "./dom";

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  const method = document.querySelector('input[name="method"]').value;
  const body = form.querySelector('textarea[name="body"]').value;

  let requestBody = {};

  if (method === "POST" || method === "PUT") {
    requestBody = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  } else {
    requestBody = {
      method,
    };
  }

  try {
    const response = await fetch(url, requestBody);

    if (!response.ok) {
      const error = new Error(response.statusText);
      throw error;
    }

    const responseBody = await response.text();

    const result = createElement("pre", responseBody);
    document.querySelector(".result").appendChild(result);
  } catch (error) {
    const errorMessage = "Error: " + error.message;
    const result = createElement("pre", errorMessage);
    document.querySelector(".result").appendChild(result);
  }
});
```