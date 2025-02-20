file path: styles.css
content: 

```css
/* Color Scheme */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #212529;
}

/* Global Styles */
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--light-color);
  color: var(--dark-color);
}

.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background-color: var(--primary-color);
  color: #fff;
  width: 250px;
  padding: 20px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  color: #fff;
  text-decoration: none;
}

main {
  flex-grow: 1;
  padding: 20px;
}

h1,
h2 {
  margin-top: 0;
}

.login-form {
  max-width: 300px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 5px;
  border: 1px solid #ccc;
}

.proxy-status {
  background-color: var(--primary-color);
  color: #fff;
  padding: 10px;
  margin-top: 20px;
}

.error-messages {
  color: var(--danger-color);
}

.connection-status {
  background-color: var(--success-color);
  color: #fff;
  padding: 10px;
  margin-top: 20px;
}

/* Media Queries */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .container {
    flex-direction: column;
  }

  main {
    padding: 0;
  }
}
```