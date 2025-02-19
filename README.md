file path: index.html
content: ```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Web Proxy</title>
    <link rel="stylesheet" href="./style.css" />
  </head>

  <body>
    <header>
      <div class="logo">
        <h1>Web Proxy</h1>
      </div>

      <nav>
        <a href="#">Home</a>
        <a href="#">Games</a>
        <a href="#">About</a>
      </nav>

      <div class="search-bar">
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>
    </header>

    <main>
      <div class="sidebar">
        <ul>
          <li><a href="#">All Games</a></li>
          <li><a href="#">Action</a></li>
          <li><a href="#">Adventure</a></li>
          <li><a href="#">RPG</a></li>
          <li><a href="#">Strategy</a></li>
        </ul>
      </div>

      <div class="game-cards"></div>
    </main>

    <footer>
      <div>
        <label for="sort-by">Sort by:</label>
        <select id="sort-by">
          <option value="title">Title</option>
          <option value="release-date">Release Date</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div class="settings">
        <label for="dark-mode">Dark Mode</label>
        <input type="checkbox" id="dark-mode" />
      </div>
    </footer>

    <script src="./game-card.js"></script>
    <script src="./main.js"></script>
  </body>
</html>
```