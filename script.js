```javascript
// script.js

const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (username.value === "" || password.value === "") {
    errorMessage.textContent = "Please fill out all fields.";
    return;
  }

  // Input validation and authentication logic goes here

  // If authentication is successful, redirect to the dashboard
  window.location.href = "/dashboard.html";
});
```