file path: style.css
content: 

```css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f8ff;
}

.wrapper {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  padding: 30px;
  background-color: #3498db;
  color: white;
}

.sidebar a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: white;
}

.sidebar a:hover {
  background-color: #2980b9;
}

.main {
  flex: 1;
  padding: 30px;
}

.main h1 {
  margin-top: 0;
}

.login-form {
  max-width: 300px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input {
  width: 100%;
  padding: 5px;
}

.status {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  margin-top: 30px;
}

.errors {
  background-color: #f1c40f;
  color: white;
  padding: 10px;
  margin-top: 30px;
}

.connection {
  background-color: #2ecc71;
  color: white;
  padding: 10px;
  margin-top: 30px;
}
```