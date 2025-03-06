document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const gamesGrid = document.getElementById('games-grid');
    const categoryButtons = document.querySelectorAll('.category-button');

    let games = [
        { name: 'Awesome Action Game', category: 'action', imageUrl: '/Games/game1.jpg', url: 'https://example.com/action1' },
        { name: 'Super Sports Game', category: 'sports', imageUrl: '/Games/game2.jpg', url: 'https://example.com/sports1' },
        { name: 'Puzzle Mania', category: 'puzzle', imageUrl: '/Games/game1.jpg', url: 'https://example.com/puzzle1' },
        { name: 'Another Action Game', category: 'action', imageUrl: '/Games/game2.jpg', url: 'https://example.com/action2' },
        { name: 'Extreme Sports', category: 'sports', imageUrl: '/Games/game1.jpg', url: 'https://example.com/sports2' },
        { name: 'Brain Teaser Puzzle', category: 'puzzle', imageUrl: '/Games/game2.jpg', url: 'https://example.com/puzzle2' },
        { name: 'Action Packed Adventure', category: 'action', imageUrl: '/Games/game1.jpg', url: 'https://example.com/action3' },
        { name: 'Ultimate Sports Challenge', category: 'sports', imageUrl: '/Games/game2.jpg', url: 'https://example.com/sports3' },
        { name: 'Mind Bending Puzzle', category: 'puzzle', imageUrl: '/Games/game1.jpg', url: 'https://example.com/puzzle3' }
    ];

    function displayGames(gamesToDisplay) {
        gamesGrid.innerHTML = '';
        gamesToDisplay.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'cyber-card';
            gameCard.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.name}" style="width:100%;">
                <h3>${game.name}</h3>
                <a href="${game.url}" class="cyber-button" target="_blank">Play Now</a>
            `;
            gamesGrid.appendChild(gameCard);
        });
    }

    function filterGames(category) {
        const filteredGames = category === 'all' ? games : games.filter(game => game.category === category);
        displayGames(filteredGames);
    }

    function searchGames(searchTerm) {
        const searchedGames = games.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));
        displayGames(searchedGames);
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterGames(this.dataset.category);
        });
    });

    searchButton.addEventListener('click', function() {
        searchGames(searchInput.value);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchGames(searchInput.value);
        }
    });

    displayGames(games);
});