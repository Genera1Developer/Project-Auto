FILE PATH: html/style.css
CONTENT: 
```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#url-input {
  width: 250px;
  padding: 0.5rem;
}

#submit-button {
  padding: 0.5rem;
  background-color: #4286f4;
  color: white;
  border: none;
  cursor: pointer;
}

#result {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

#result-header {
  font-weight: bold;
}

#result-body {
  white-space: pre-line;
}
```