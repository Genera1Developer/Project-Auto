FILE PATH: views/styles.css
CONTENT: 
```css
body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    line-height: 1.5;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

input[type="text"] {
    width: 300px;
    padding: 5px;
    margin-bottom: 10px;
}

input[type="submit"] {
    width: 100px;
    padding: 5px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#result {
    width: 600px;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    overflow: scroll;
}
```