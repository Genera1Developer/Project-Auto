file path: index.html
content: ```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <link rel="stylesheet" href="./style.css">
</head>

<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Games</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
    <div class="search-bar">
      <input type="text" placeholder="Search games">
      <button type="submit">Search</button>
    </div>
  </header>

  <main>
    <div class="sidebar">
      <ul>
        <li><a href="#">All Games</a></li>
        <li><a href="#">Action</a></li>
        <li><a href="#">Adventure</a></li>
        <li><a href="#">RPG</a></li>
        <li><a href="#">Simulation</a></li>
        <li><a href="#">Strategy</a></li>
        <li><a href="#">Sports</a></li>
        <li><a href="#">Racing</a></li>
      </ul>
    </div>

    <div class="game-cards">
      <div class="game-card">
        <img src="./images/game1.jpg" alt="Game 1">
        <div class="game-card-info">
          <h2 class="game-card-title">Game 1</h2>
          <p class="game-card-description">This is a description of Game 1.</p>
        </div>
      </div>
      <div class="game-card">
        <img src="./images/game2.jpg" alt="Game 2">
        <div class="game-card-info">
          <h2 class="game-card-title">Game 2</h2>
          <p class="game-card-description">This is a description of Game 2.</p>
        </div>
      </div><div class="game-card">
        <img src="./images/game3.jpg" alt="Game 3">
        <div class="game-card-info">
          <h2 class="game-card-title">Game 3</h2>
          <p class="game-card-description">This is a description of Game 3.</p>
        </div>
      </div><div class="game-card">
        <img src="./images/game4.jpg" alt="Game 4">
        <div class="game-card-info">
          <h2 class="game-card-title">Game 4</h2>
          <p class="game-card-description">This is a description of Game 4.</p>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="settings">
      <label for="sort">Sort by:</label>
      <select name="sort">
        <option value="name">Name</option>
        <option value="release_date">Release Date</option>
        <option value="rating">Rating</option>
      </select>
      <label for="view">View:</label>
      <input type="checkbox" name="view" id="grid-view">
      <label for="grid-view">Grid</label>
      <input type="checkbox" name="view" id="list-view">
      <label for="list-view">List</label>
    </div>
  </footer>
</body>

</html>
```