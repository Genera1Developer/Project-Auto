file path: style.css
content: ```css
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #eee;
}

header .logo {
  font-size: 24px;
  font-weight: bold;
}

header nav {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

header nav a {
  margin-right: 20px;
  text-decoration: none;
  color: #000;
}

header nav a:hover {
  color: #333;
}

header .search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

header .search-bar input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

header .search-bar button {
  padding: 5px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

header .search-bar button:hover {
  background-color: #333;
}

main {
  display: flex;
  justify-content: space-between;
}

main .sidebar {
  padding: 10px;
  background-color: #eee;
  width: 200px;
}

main .sidebar ul {
  list-style-type: none;
  padding: 0;
}

main .sidebar ul li {
  margin-bottom: 10px;
}

main .sidebar ul li a {
  text-decoration: none;
  color: #000;
}

main .sidebar ul li a:hover {
  color: #333;
}

main .game-cards {
  padding: 10px;
  width: calc(100% - 200px);
}

main .game-cards .game-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #eee;
}

main .game-cards .game-card img {
  width: 100px;
}

main .game-cards .game-card .info {
  margin-left: 10px;
}

main .game-cards .game-card .info h3 {
  font-size: 18px;
}

main .game-cards .game-card .info p {
  font-size: 14px;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #eee;
}

footer .settings {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

footer .settings label {
  margin-right: 5px;
}
```