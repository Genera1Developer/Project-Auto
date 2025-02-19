file path: style.css
content: ```css
/* CSS styles for a web proxy */

:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --light-color: #f8f9fa;
  --dark-color: #212529;
}

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: var(--dark-color);
  background-color: var(--light-color);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--light-color);
}

header nav {
  display: flex;
  gap: 1rem;
}

header nav a {
  text-decoration: none;
  color: var(--light-color);
}

header nav a:hover {
  color: var(--secondary-color);
}

header .search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

header .search-bar input {
  width: 20rem;
  padding: 0.5rem;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
}

header .search-bar button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  background-color: var(--secondary-color);
  color: var(--light-color);
}

main {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

main .sidebar {
  width: 15rem;
  background-color: var(--light-color);
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
}

main .sidebar ul {
  list-style-type: none;
  padding: 0;
}

main .sidebar ul a {
  display: block;
  padding: 0.5rem;
  text-decoration: none;
  color: var(--dark-color);
}

main .sidebar ul a:hover {
  color: var(--primary-color);
}

main .game-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

main .game-card {
  background-color: var(--light-color);
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
}

main .game-card img {
  width: 100%;
  height: 15rem;
  object-fit: cover;
}

main .game-card-info {
  padding: 1rem;
}

main .game-card-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

main .game-card-description {
  font-size: 0.8rem;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--light-color);
}

footer .settings {
  display: flex;
  align-items: center;
  gap: 1rem;
}

footer .settings select {
  padding: 0.5rem;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
}

footer .settings label {
  margin-right: 0.5rem;
}

footer .settings input[type="checkbox"] {
  accent-color: var(--primary-color);
}
```

file path: game-card.js
content: ```javascript
class GameCard {
  constructor(gameData) {
    this.gameData = gameData;

    this.card = document.createElement('div');
    this.card.classList.add('game-card');

    this.image = document.createElement('img');
    this.image.src = this.gameData.image;
    this.image.alt = this.gameData.title;

    this.info = document.createElement('div');
    this.info.classList.add('game-card-info');

    this.title = document.createElement('h2');
    this.title.classList.add('game-card-title');
    this.title.textContent = this.gameData.title;

    this.description = document.createElement('p');
    this.description.classList.add('game-card-description');
    this.description.textContent = this.gameData.description;

    this.info.appendChild(this.title);
    this.info.appendChild(this.description);

    this.card.appendChild(this.image);
    this.card.appendChild(this.info);
  }

  render() {
    return this.card;
  }
}
```