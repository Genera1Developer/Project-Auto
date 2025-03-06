document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const gamesGrid = document.getElementById('games-grid');
    const categoryButtons = document.querySelectorAll('.category-button');

    const games = [
        {
            name: "Drift Boss",
            category: "action",
            image: "/Games/game1.jpg",
            url: "https://drift-boss.io/"
        },
        {
            name: "Basketball Stars",
            category: "sports",
            image: "/Games/game2.jpg",
            url: "https://basketball-stars.io/"
        },
        {
            name: "Puzzle Bobble",
            category: "puzzle",
            image: "/Games/game1.jpg",
            url: "https://puzzle-bobble.net/"
        },
        {
            name: "Highway Rider Extreme",
            category: "action",
            image: "/Games/game2.jpg",
            url: "https://highwayrider.extreme/"
        }
    ];

    function displayGames(gamesToDisplay) {
        gamesGrid.innerHTML = '';
        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'cyber-card';
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.name}" class="w-full h-48 object-cover rounded-md mb-2">
                <h3 class="text-lg font-semibold text-white mb-2">${game.name}</h3>
                <a href="${game.url}" class="cyber-button" target="_blank">Play Now</a>
            `;
            gamesGrid.appendChild(gameCard);
        });
    }

    function filterGames(category) {
        if (category === 'all') {
            displayGames(games);
        } else {
            const filteredGames = games.filter(game => game.category === category);
            displayGames(filteredGames);
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterGames(category);

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        window.location.href = `https://www.google.com/search?q=${searchTerm}`;
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    displayGames(games);
});

edit filepath: public/games.css
content: .category-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.category-button {
    background-color: #333;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.category-button:hover {
    background-color: #555;
}

.category-button.active {
    background-color: #4CAF50;
    color: white;
}

edit filepath: index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curse - Home</title>
    <link rel="stylesheet" href="/public/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to Curse</h1>
            <p>Your gateway to games and the internet</p>
        </header>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/public/Games/index.html">Games</a></li>
            </ul>
        </nav>
    </div>
</body>
</html>

edit filepath: api/route.js
content: const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/proxy', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    request(url, (error, response, body) => {
        if (error) {
            console.error('Proxy error:', error);
            return res.status(500).send('Proxy error');
        }

        res.send(body);
    });
});

module.exports = router;

edit filepath: server.js
content: const express = require('express');
const app = express();
const path = require('path');
const proxyRoute = require('./api/route');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/api', proxyRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

edit filepath: package.json
content: {
  "name": "curse",
  "version": "1.0.0",
  "description": "A web proxy and games portal",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "request": "^2.88.2"
  }
}

edit filepath: .gitignore
content: node_modules/

edit filepath: Games/game3.jpg
content: Placeholder image for game3.jpg