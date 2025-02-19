Based on the project goal, a new file should be created forstylesheet:

FILE PATH: public/css/proxy.css
CONTENT: 
```css
body {
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}

input[type="submit"] {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
```