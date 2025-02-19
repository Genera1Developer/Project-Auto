file path: index.html
content: ```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Curse</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <div class="wrapper">
    <header>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
      <div class="search-bar">
        <input type="text" placeholder="Search for games..." />
        <button type="submit">Search</button>
      </div>
    </header>
    <main>
      <div class="sidebar">
        <ul>
          <li><a href="#">Action</a></li>
          <li><a href="#">Adventure</a></li>
          <li><a href="#">Indie</a></li>
          <li><a href="#">Multiplayer</a></li>
          <li><a href="#">RPG</a></li>
          <li><a href="#">Simulation</a></li>
          <li><a href="#">Strategy</a></li>
        </ul>
      </div>
      <div class="game-cards">
        <!-- Game cards will be injected here -->
      </div>
    </main>
    <footer>
      <div class="settings">
        <label for="theme">Theme:</label>
        <select id="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <label for="particles">Particles:</label>
        <input type="checkbox" id="particles" />
      </div>
      <p>Made with ❤️ by <a href="#">Genera1Developer</a></p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>

</html>
```