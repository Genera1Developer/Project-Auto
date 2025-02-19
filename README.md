file path: style.css
content: ```css
/* Global styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

a {
  text-decoration: none;
  color: #000;
}

ul {
  list-style-type: none;
}

/* Header styles */

header {
  width: 100%;
  height: 80px;
  background-color: #222;
}

nav {
  float: left;
}

nav ul {
  display: flex;
}

nav li {
  margin-right: 20px;
}

nav li a {
  color: #fff;
  font-size: 18px;
}

.search-bar {
  float: right;
  margin-right: 20px;
}

.search-bar input {
  width: 200px;
  height: 30px;
  padding: 5px;
  border: 1px solid #ccc;
}

.search-bar button {
  margin-left: 10px;
  width: 70px;
  height: 30px;
  background-color: #000;
  color: #fff;
  border: none;
}

/* Main content styles */

main {
  display: flex;
  margin-top: 20px;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
}

.sidebar ul {
  list-style-position: inside;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar li a {
  font-size: 16px;
}

.game-cards {
  width: 100%;
  padding: 20px;
}

.game-card {
  display: flex;
  width: 100%;
  height: 150px;
  background-color: #fff;
  margin-bottom: 20px;
}

.game-card img {
  width: 100px;
  height: 100%;
}

.game-card-info {
  padding: 10px;
}

.game-card-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.game-card-description {
  font-size: 14px;
}

/* Footer styles */

footer {
  width: 100%;
  height: 60px;
  background-color: #222;
  color: #fff;
  padding: 10px;
}

.settings {
  float: left;
}

.settings label {
  margin-right: 5px;
}

.settings select {
  width: 100px;
  height: 30px;
  padding: 5px;
  border: 1px solid #ccc;
}

.settings input[type="checkbox"] {
  margin-right: 5px;
}
```